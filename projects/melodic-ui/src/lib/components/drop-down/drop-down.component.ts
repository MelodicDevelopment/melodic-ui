import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	ElementRef,
	forwardRef,
	inject,
	input,
	InputSignal,
	OnInit,
	output,
	OutputEmitterRef,
	Signal,
	signal,
	Type,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { MDPopupComponent } from '../popup/popup.component';

export interface IMDDropDownOption {
	value: string | number;
	label: string;
	icon?: string;
	selected?: boolean;
}

@Component({
	selector: 'md-drop-down',
	standalone: true,
	imports: [CommonModule, MDIconComponent, MDPopupComponent],
	templateUrl: './drop-down.component.html',
	styleUrl: './drop-down.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MDDropDownComponent),
			multi: true
		}
	],
	encapsulation: ViewEncapsulation.None
})
export class MDDropDownComponent implements ControlValueAccessor, OnInit {
	private _elementRef: ElementRef = inject(ElementRef);

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	private _value: unknown;

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
		toObservable(this.options)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((options) => {
				this.internalOptions.set(options);
			});

		toObservable(this.value)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((value) => {
				this.writeValue(value);
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
		this.writeValue(this.value());
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

	public writeValue(value: unknown): void {
		this.onChange(value);
		this.onTouched();

		this.change.emit(value);

		this._value = value;

		this.setSelectedOptions(value);
	}

	public setSelectedOptions(value: unknown): void {
		if (value) {
			if (Array.isArray(value)) {
				this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: (value as Array<string | number>).includes(o.value) }))]);
				return;
			}

			this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: value === o.value }))]);
		}
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
