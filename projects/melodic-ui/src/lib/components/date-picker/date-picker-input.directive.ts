import { Directive, ElementRef, forwardRef, Host, HostListener, inject, input, InputSignal, output, OutputEmitterRef, ViewContainerRef } from '@angular/core';
import { MDDatePickerComponent } from './date-picker.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs';
import { Day } from './types/date.types';

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
export class MDDatePickerInputDirective implements ControlValueAccessor {
	private _overlay: Overlay = inject(Overlay);

	private _onChange = (value: any) => {};
	private _onTouched = () => {};

	private _overlayRef: OverlayRef | null = null;
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _dateInputEl: HTMLInputElement = this._elementRef.nativeElement as HTMLInputElement;

	private _isActive: boolean = false;

	public update: OutputEmitterRef<string> = output<string>();
	public disabledDateFn: InputSignal<(day: Day) => boolean> = input<(day: Day) => boolean>(() => false);

	// deprecated
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

	@HostListener('blur')
	onBlur(): void {
		setTimeout(() => {
			if (!this._isActive) {
				this.closeCalendar();
			}
		}, 300);
	}

	@HostListener('focus')
	onFocus(): void {
		if (this._overlayRef) {
			return;
		}

		const positionStrategy = this._overlay
			.position()
			.flexibleConnectedTo(this._elementRef)
			.withPositions([
				{
					originX: 'start',
					originY: 'bottom',
					overlayX: 'start',
					overlayY: 'top'
				},
				{
					originX: 'start',
					originY: 'top',
					overlayX: 'start',
					overlayY: 'bottom'
				}
			]);

		this._overlayRef = this._overlay.create({
			positionStrategy,
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-transparent-backdrop'
		});

		const calendarPortal = new ComponentPortal(MDDatePickerComponent, this._viewContainerRef);
		const calendarRef = this._overlayRef.attach(calendarPortal);

		calendarRef.setInput('isPastDaysDisabled', this.isPastDaysDisabled());
		calendarRef.setInput('disabledDateFn', this.disabledDateFn());

		(calendarRef.location.nativeElement as HTMLElement).addEventListener('mouseover', () => (this._isActive = true));
		(calendarRef.location.nativeElement as HTMLElement).addEventListener('mouseout', () => (this._isActive = false));

		if (this._dateInputEl.value) {
			calendarRef.setInput('selectedDates', [new Date(`${this._dateInputEl.value} 00:00:00`)]);
		}

		calendarRef.instance.change.subscribe((dates: Date[]) => {
			this._isActive = true;

			const dateValue = this.setDateValue(dates);
			this.update.emit(dateValue);

			this.closeCalendar();
		});

		this._overlayRef
			.backdropClick()
			.pipe(take(1))
			.subscribe(() => this.closeCalendar());
	}

	constructor() {
		if (this._dateInputEl.tagName !== 'INPUT' || this._dateInputEl.type !== 'date') {
			console.error('The md-date-picker-input directive must be applied to an input element with type="date"');
			return;
		}
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

		this._onChange(dateValue);
		this._onTouched();

		return dateValue;
	}

	private closeCalendar() {
		if (this._overlayRef) {
			this._overlayRef.dispose();
			this._overlayRef = null;
			this._isActive = false;
		}
	}
}
