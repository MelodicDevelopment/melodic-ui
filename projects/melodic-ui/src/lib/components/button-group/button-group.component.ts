import { AfterViewInit, Component, ContentChildren, forwardRef, Input, OnInit, output, OutputEmitterRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
		}
	]
})
export class MDButtonGroupComponent implements ControlValueAccessor, OnInit, AfterViewInit {
	private _values: unknown[] = [];

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	@ContentChildren(MDButtonToggleComponent) private _buttonToggles!: QueryList<MDButtonToggleComponent>;

	@Input() public value: unknown;
	@Input() public multiple: boolean = false;
	@Input() public disabled: boolean = false;

	public change: OutputEmitterRef<unknown> = output<unknown>();

	ngOnInit(): void {
		if (this.value) {
			this._values = Array.isArray(this.value) ? this.value : [this.value];
		}
	}

	ngAfterViewInit(): void {
		if (this._buttonToggles.length === 0) {
			throw new Error('No button toggles found in the button group.');
		}

		this._buttonToggles.forEach((toggle) => {
			toggle.checked = this._values.includes(toggle.value);
			toggle.disabled = this.disabled;

			toggle.change.subscribe((value) => {
				if (this.multiple) {
					if (this._values.includes(toggle.value)) {
						this._values = this._values.filter((v) => v !== toggle.value);
					}

					if (value !== null) {
						this._values.push(value);
					}
				} else {
					this._values = [];
					if (value !== null) {
						this._values = [value];
					}
				}

				this.writeValue(this.multiple ? this._values : this._values[0]);

				this._buttonToggles.forEach((t) => {
					if (!this._values.includes(t.value)) {
						t.checked = false;
					}
				});
			});
		});

		this.setDisabledState(this.disabled);
	}

	writeValue(value: unknown): void {
		this.value = value;

		this.onChange(this.value);
		this.onTouched();

		this.change.emit(this.value);
	}

	// used internally by angular forms
	registerOnChange(fn: (value: unknown) => void): void {
		this.onChange = fn;
	}

	// used internally by angular forms
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		if (!this._buttonToggles) {
			return;
		}
		this._buttonToggles.forEach((toggle) => {
			toggle.disabled = isDisabled;
		});
	}
}
