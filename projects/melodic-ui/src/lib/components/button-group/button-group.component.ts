import {
	AfterViewInit,
	Component,
	ComponentRef,
	ContentChildren,
	effect,
	ElementRef,
	forwardRef,
	input,
	Input,
	InputSignal,
	OnInit,
	output,
	OutputEmitterRef,
	QueryList
} from '@angular/core';
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
export class MDButtonGroupComponent implements ControlValueAccessor, AfterViewInit {
	private _values: unknown[] = [];

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	@ContentChildren(MDButtonToggleComponent) private _buttonToggles!: QueryList<MDButtonToggleComponent>;
	@ContentChildren(MDButtonToggleComponent, { read: ElementRef }) private _buttonToggleRefs!: QueryList<ElementRef>;

	public value: InputSignal<unknown> = input();
	public multiple: InputSignal<boolean> = input(false);
	public disabled: InputSignal<boolean> = input(false);

	public change: OutputEmitterRef<unknown> = output<unknown>();

	constructor() {
		effect(() => {
			if (!this._buttonToggles) {
				return;
			}
			this._buttonToggles.forEach((toggle, index) => {
				console.log(this._buttonToggleRefs.toArray()[index].nativeElement);
				if (!(this._buttonToggleRefs.toArray()[index].nativeElement as HTMLElement).hasAttribute('ng-reflect-disabled')) {
					toggle.disabled = this.disabled();
				}
			});
		});

		effect(() => {
			if (this.value()) {
				this._values = Array.isArray(this.value()) ? (this.value() as unknown[]) : [this.value()];
			}
		});
	}

	ngAfterViewInit(): void {
		if (this._buttonToggles.length === 0) {
			throw new Error('No button toggles found in the button group.');
		}

		this._buttonToggles.forEach((toggle) => {
			toggle.checked.set(this._values.includes(toggle.value()));

			toggle.change.subscribe((value) => {
				if (this.multiple()) {
					if (this._values.includes(toggle.value())) {
						this._values = this._values.filter((v) => v !== toggle.value());
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

				this.writeValue(this.multiple() ? this._values : this._values[0]);

				this._buttonToggles.forEach((t) => {
					if (!this._values.includes(t.value())) {
						t.checked.set(false);
					}
				});
			});
		});
	}

	writeValue(value: unknown): void {
		this.onChange(this._values);
		this.onTouched();

		this.change.emit(this._values);
	}

	// used internally by angular forms
	registerOnChange(fn: (value: unknown) => void): void {
		this.onChange = fn;
	}

	// used internally by angular forms
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
}
