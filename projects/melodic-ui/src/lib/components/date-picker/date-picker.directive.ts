import { AfterViewInit, Directive, ElementRef, inject, ViewContainerRef } from '@angular/core';
import { MDDatePickerComponent } from './date-picker.component';

@Directive({
	standalone: true,
	selector: '[md-date-picker]'
})
export class MDDatePickerDirective implements AfterViewInit {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _dateInputContainer: HTMLDivElement = document.createElement('div');
	private _dateInputEl: HTMLInputElement = this._elementRef.nativeElement as HTMLInputElement;

	constructor() {
		if (this._dateInputEl.tagName !== 'INPUT' || this._dateInputEl.type !== 'date') {
			console.error('Date Picker directive must be applied to an input element with type="date"');
			return;
		}

		this._dateInputEl.type = 'text';

		this._dateInputContainer.classList.add('md-date-picker-container');
		this._dateInputEl.after(this._dateInputContainer);

		this._dateInputContainer.appendChild(this._dateInputEl);
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const componentRef = this._viewContainerRef.createComponent<MDDatePickerComponent>(MDDatePickerComponent);

		const datePickerComponent = componentRef.location.nativeElement as HTMLElement;
		datePickerComponent.classList.add('as-directive');

		this._dateInputContainer.appendChild(datePickerComponent);

		this._dateInputEl.addEventListener('focus', () => {
			datePickerComponent.classList.add('open');
		});
	}
}
