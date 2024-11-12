import {
	AfterViewInit,
	Directive,
	ElementRef,
	forwardRef,
	HostListener,
	inject,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	ViewContainerRef
} from '@angular/core';
import { MDDatePickerComponent } from './date-picker.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
	standalone: true,
	selector: '[md-date-picker-input]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MDDatePickerInputDirective),
			multi: true
		}
	]
})
export class MDDatePickerInputDirective implements AfterViewInit, ControlValueAccessor {
	private _onChange = (value: any) => {};
	private _onTouched = () => {};

	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _dateInputContainer: HTMLDivElement = document.createElement('div');
	private _datePickerComponent: HTMLElement = document.createElement('div');
	private _dateInputEl: HTMLInputElement = this._elementRef.nativeElement as HTMLInputElement;

	public update: OutputEmitterRef<string> = output<string>();
	public isPastDaysDisabled: InputSignal<boolean> = input<boolean>(false);

	@HostListener('input')
	onInput(): void {
		this.update.emit(this._dateInputEl.value);
	}

	@HostListener('change')
	onChange(): void {
		const selectedDate: Date = new Date(`${this._dateInputEl.value} 00:00:00`);
		const dateValue = this.setDateValue(this._dateInputEl.value ? [selectedDate] : []);
		this.update.emit(dateValue);
	}

	@HostListener('focus')
	onFocus(): void {
		this._datePickerComponent.classList.add('open');
	}

	constructor() {
		if (this._dateInputEl.tagName !== 'INPUT' || this._dateInputEl.type !== 'date') {
			console.error('The md-date-picker-input directive must be applied to an input element with type="date"');
			return;
		}

		this._dateInputContainer.classList.add('md-date-picker-container');
		this._dateInputEl.after(this._dateInputContainer);

		this._dateInputContainer.appendChild(this._dateInputEl);
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const componentRef = this._viewContainerRef.createComponent<MDDatePickerComponent>(MDDatePickerComponent);

		componentRef.setInput('isPastDaysDisabled', this.isPastDaysDisabled());

		if (this._dateInputEl.value) {
			componentRef.instance.initDates = [new Date(`${this._dateInputEl.value} 00:00:00`)];
		}

		componentRef.instance.change.subscribe((dates: Date[]) => {
			const dateValue = this.setDateValue(dates);
			this.update.emit(dateValue);
		});

		this._datePickerComponent = componentRef.location.nativeElement as HTMLElement;
		this._datePickerComponent.classList.add('as-directive');

		this._dateInputContainer.appendChild(this._datePickerComponent);

		document.addEventListener('click', (event: MouseEvent) => {
			if (!this._dateInputContainer.contains(event.target as Node)) {
				this._datePickerComponent.classList.remove('open');
			}
		});
	}

	writeValue(value: Date[] | string): void {
		if (typeof value === 'string') {
			const dateValue = new Date(`${value} 00:00`);
			value = [dateValue];
		}

		this.setDateValue(value ? value : []);
	}

	registerOnChange(fn: (value: any) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	private setDateValue(dates: Date[]): string {
		let dateValue: string = '';

		if (dates.length === 1) {
			dateValue = `${dates[0].getFullYear()}-${(dates[0].getMonth() + 1).toString().padStart(2, '0')}-${dates[0].getDate().toString().padStart(2, '0')}`;
		}

		this._dateInputEl.value = dateValue;
		this._datePickerComponent.classList.remove('open');

		this._onChange(dateValue);
		this._onTouched();

		return dateValue;
	}
}
