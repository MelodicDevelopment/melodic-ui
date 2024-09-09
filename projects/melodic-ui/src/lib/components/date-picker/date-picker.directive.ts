import { AfterViewInit, Directive, ElementRef, inject, ViewContainerRef, WritableSignal } from '@angular/core';
import { MDDatePickerComponent } from './date-picker.component';

@Directive({
	standalone: true,
	selector: '[md-date-picker]'
})
export class MDDatePickerDirective implements AfterViewInit {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _dateInputContainer: HTMLDivElement = document.createElement('div');
	private _datePickerComponent: HTMLElement = document.createElement('div');
	private _dateInputEl: HTMLInputElement = this._elementRef.nativeElement as HTMLInputElement;

	constructor() {
		if (this._dateInputEl.tagName !== 'INPUT' || this._dateInputEl.type !== 'date') {
			console.error('Date Picker directive must be applied to an input element with type="date"');
			return;
		}

		this._dateInputContainer.classList.add('md-date-picker-container');
		this._dateInputEl.after(this._dateInputContainer);

		this._dateInputContainer.appendChild(this._dateInputEl);
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const componentRef = this._viewContainerRef.createComponent<MDDatePickerComponent>(MDDatePickerComponent);

		if (this._dateInputEl.value) {
			componentRef.instance.initDates = [new Date(`${this._dateInputEl.value} 00:00:00`)];
		}

		componentRef.instance.change.subscribe((dates: Date[]) => this.setDateValue(dates));

		this._datePickerComponent = componentRef.location.nativeElement as HTMLElement;
		this._datePickerComponent.classList.add('as-directive');

		this._dateInputContainer.appendChild(this._datePickerComponent);

		this._dateInputEl.addEventListener('focus', () => {
			this._datePickerComponent.classList.add('open');
		});

		document.addEventListener('click', (event: MouseEvent) => {
			if (!this._dateInputContainer.contains(event.target as Node)) {
				this._datePickerComponent.classList.remove('open');
			}
		});
	}

	private setDateValue(dates: Date[]): void {
		let dateValue: string = '';

		if (dates.length === 1) {
			dateValue = `${dates[0].getFullYear()}-${(dates[0].getMonth() + 1).toString().padStart(2, '0')}-${dates[0].getDate().toString().padStart(2, '0')}`;
		}

		this._dateInputEl.value = dateValue;
		this._datePickerComponent.classList.remove('open');
	}
}
