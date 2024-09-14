import {
	AfterViewInit,
	Component,
	ComponentRef,
	ContentChildren,
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
	@ContentChildren(MDButtonToggleComponent) buttonToggles!: QueryList<MDButtonToggleComponent>;

	// public value: InputSignal<unknown> = input();
	// public multiple: InputSignal<boolean> = input(false);
	// public disabled: InputSignal<boolean> = input(false);

	public change: OutputEmitterRef<unknown> = output<unknown>();

	value: unknown | unknown[] = null;
	showError: boolean = false;

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	ngAfterViewInit(): void {
		this.buttonToggles.forEach((toggle) => {
			toggle.change.subscribe((value) => {
				this.writeValue(value);

				this.buttonToggles.forEach((t) => {
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

		this.value = value;
		this.onChange(this.value);
		this.onTouched();
		this.change.emit(this.value);
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

	// Optional: If you want to disable the input
	setDisabledState(isDisabled: boolean): void {
		console.log('setDisabledState', isDisabled);
		this.buttonToggles.forEach((toggle) => {
			toggle.disabled = isDisabled;
		});

		// Handle the disabled state
	}

	// Validator interface method
	validate(control: AbstractControl): ValidationErrors | null {
		console.log('validate', control);
		if (!this.value) {
			this.showError = true;
			return { required: true };
		}
		this.showError = false;
		return null;
	}
}
