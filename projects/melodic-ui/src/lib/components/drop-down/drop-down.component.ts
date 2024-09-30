import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	ElementRef,
	forwardRef,
	inject,
	Input,
	input,
	InputSignal,
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

export interface IMDDropDownOption {
	value: string | number;
	label: string;
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
export class MDDropDownComponent implements ControlValueAccessor, OnInit {
	private _elementRef: ElementRef = inject(ElementRef);

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	@Input() public value: unknown;
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

	ngOnInit(): void {
		(this._elementRef.nativeElement as HTMLElement).querySelector('input')?.addEventListener('focus', () => {
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

		if (this.value) {
			if (Array.isArray(this.value)) {
				this.internalOptions.set([
					...this.internalOptions().map((o) => ({ ...o, selected: (this.value as Array<string | number>).includes(o.value) }))
				]);
				return;
			}

			this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: this.value === o.value }))]);
		}
	}

	public optionSelected(option: IMDDropDownOption): void {
		if (!this.multiple()) {
			this.internalOptions().forEach((o) => (o.selected = false));
			this.isActive.set(false);
		}

		option.selected = !option.selected;

		this.internalOptions.set([...this.internalOptions()]);

		this.writeValue(
			this.internalOptions()
				.filter((o) => o.selected)
				.map((o) => o.value)
		);
	}

	writeValue(value: unknown): void {
		this.value = value;

		this.onChange(this.value);
		this.onTouched();

		this.change.emit(this.value);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}
