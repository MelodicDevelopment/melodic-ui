import {
	AfterViewInit,
	Component,
	ComponentRef,
	ContentChildren,
	effect,
	forwardRef,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	QueryList,
	ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MDButtonToggleComponent } from './components/button-toggle/button-toggle.component';

@Component({
	selector: 'md-button-group',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button-group.component.html',
	styleUrl: './button-group.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MDButtonGroupComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MDButtonGroupComponent),
			multi: true
		}
	]
})
export class MDButtonGroupComponent implements ControlValueAccessor, Validator, AfterViewInit {
	private _value: unknown | unknown[] = null;
	private _showError: boolean = false;

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	@ContentChildren(MDButtonToggleComponent) private _buttonToggles!: QueryList<MDButtonToggleComponent>;

	public value: InputSignal<unknown> = input();
	public multiple: InputSignal<boolean> = input(false);
	public disabled: InputSignal<boolean> = input(false);

	public change: OutputEmitterRef<unknown> = output<unknown>();

	constructor() {
		effect(() => {
			this._buttonToggles.forEach((toggle) => {
				toggle.disabled = this.disabled();
			});
		});
	}

	ngAfterViewInit(): void {
		this._buttonToggles.forEach((toggle) => {
			if (this.value() === toggle.value) {
				toggle.checked = true;
				this.writeValue(toggle.value);
			}

			toggle.disabled = this.disabled();

			toggle.change.subscribe((value) => {
				this.writeValue(value);

				this._buttonToggles.forEach((t) => {
					t.checked = false;
				});

				toggle.checked = value !== null;
			});
		});
	}

	// Called by Angular when the form control value changes (e.g. programmatically)
	writeValue(value: unknown): void {
		if (Array.isArray(this.value)) {
			this.value.push(value);
			return;
		}

		this._value = value;
		this.onChange(this._value);
		this.onTouched();
		this.change.emit(this._value);

		console.log('writeValue', this._value);
	}

	// Registers the callback to be called when the value changes
	registerOnChange(fn: (value: unknown) => void): void {
		console.log('registerOnChange', fn);
		this.onChange = fn;
	}

	// Registers the callback to be called when the input is touched
	registerOnTouched(fn: () => void): void {
		console.log('registerOnTouched', fn);
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this._buttonToggles.forEach((toggle) => {
			toggle.disabled = isDisabled;
		});
	}

	// Validator interface method
	validate(control: AbstractControl): ValidationErrors | null {
		// if (!this.value) {
		// 	this._showError = true;
		// 	return { required: true };
		// }

		// this._showError = false;
		// return null;
		return null;
	}
}
