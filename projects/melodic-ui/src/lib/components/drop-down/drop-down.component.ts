import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	ElementRef,
	forwardRef,
	inject,
	input,
	InputSignal,
	OnDestroy,
	OnInit,
	output,
	OutputEmitterRef,
	Signal,
	signal,
	Type,
	WritableSignal
} from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

export interface IMDDropDownOption {
	value: string | number;
	label: string;
	icon?: string;
	selected?: boolean;
}

@Component({
	selector: 'md-drop-down',
	standalone: true,
	imports: [CommonModule, MDContentBoxComponent, MDIconComponent],
	templateUrl: './drop-down.component.html',
	styleUrl: './drop-down.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MDDropDownComponent),
			multi: true
		}
	]
})
export class MDDropDownComponent implements ControlValueAccessor, OnInit, OnDestroy {
	private _elementRef: ElementRef = inject(ElementRef);
	private _destroy: Subject<void> = new Subject<void>();

	private _value: unknown;

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	public value: InputSignal<unknown> = input();
	public options: InputSignal<IMDDropDownOption[]> = input.required();
	public multiple: InputSignal<boolean> = input(false);
	public placeholder: InputSignal<string> = input('');
	public disabled: InputSignal<boolean> = input(false);
	public optionComponent: InputSignal<Type<Component> | undefined> = input();

	public input: OutputEmitterRef<unknown> = output<unknown>();
	public change: OutputEmitterRef<unknown> = output<unknown>();
	public focus: OutputEmitterRef<void> = output<void>();
	public blur: OutputEmitterRef<void> = output<void>();

	public isActive: WritableSignal<boolean> = signal(false);

	public internalOptions: WritableSignal<IMDDropDownOption[]> = signal([]);
	public selectedOptions: Signal<IMDDropDownOption[]> = computed(() => {
		return this.internalOptions().filter((o) => o.selected);
	});

	constructor() {
		toObservable(this.value)
			.pipe(takeUntil(this._destroy))
			.subscribe((value) => {
				if (value) {
					if (Array.isArray(value)) {
						this.internalOptions.set([
							...this.internalOptions().map((o) => ({ ...o, selected: (value as Array<string | number>).includes(o.value) }))
						]);
						return;
					}

					this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: value === o.value }))]);
				}

				if (value !== this._value) {
					this.writeValue(value);
				}
			});

		toObservable(this.options)
			.pipe(takeUntil(this._destroy))
			.subscribe((value) => {
				this.internalOptions.set(value);
			});
	}

	ngOnInit(): void {
		const inputElement: HTMLInputElement = (this._elementRef.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
		const dropdownWrapperElement: HTMLElement = (this._elementRef.nativeElement as HTMLElement).querySelector('div.dropdown-input-wrapper') as HTMLElement;

		dropdownWrapperElement?.addEventListener('click', () => {
			if (!this.disabled() && !this.isActive()) {
				inputElement?.focus();
			}
		});

		inputElement?.addEventListener('focus', () => {
			this.isActive.set(true);
		});

		document.addEventListener('click', (event: MouseEvent) => {
			if (this.isActive()) {
				if (!this._elementRef.nativeElement.contains(event.target as Node)) {
					this.isActive.set(false);
					this.onTouched();
				}
			}
		});

		this.internalOptions.set(this.options());
	}

	ngOnDestroy(): void {
		this._destroy.next();
		this._destroy.complete();
	}

	public optionSelected(option: IMDDropDownOption, event?: MouseEvent): void {
		if (event) {
			event.stopPropagation();
		}

		if (!this.multiple()) {
			this.internalOptions().forEach((o) => (o.selected = false));
			this.isActive.set(false);
		}

		option.selected = !option.selected;

		this.internalOptions.set([...this.internalOptions()]);

		if (!this.multiple()) {
			this.writeValue(option.value);
			return;
		}

		this.writeValue(
			this.internalOptions()
				.filter((o) => o.selected)
				.map((o) => o.value)
		);
	}

	writeValue(value: unknown): void {
		this.onChange(value);
		this.onTouched();

		this.change.emit(value);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
