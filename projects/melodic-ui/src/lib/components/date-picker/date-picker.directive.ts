import { AfterViewInit, Directive, ElementRef, inject, ViewContainerRef } from '@angular/core';
import { MDDatePickerComponent } from './date-picker.component';

@Directive({
	standalone: true,
	selector: '[md-date-picker]'
})
export class MDDatePickerDirective implements AfterViewInit {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);

	constructor() {
		if (this._elementRef.nativeElement.tagName !== 'INPUT' || this._elementRef.nativeElement.type !== 'date') {
			console.error('Date Picker directive must be applied to an input element with type="date"');
			return;
		}

		this._elementRef.nativeElement.type = 'text';
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const componentRef = this._viewContainerRef.createComponent<MDDatePickerComponent>(MDDatePickerComponent);

		const datePickerComponentRef = componentRef.location.nativeElement as HTMLElement;
		datePickerComponentRef.style.position = 'fixed';
		datePickerComponentRef.style.top = `${this._elementRef.nativeElement.offsetTop + this._elementRef.nativeElement.offsetHeight}px`;
		datePickerComponentRef.style.left = `${this._elementRef.nativeElement.offsetLeft}px`;
		datePickerComponentRef.style.zIndex = '1000';

		// console.log(this._viewContainerRef.element.nativeElement);
		// console.log(componentRef.location.nativeElement);

		// console.log(this._viewContainerRef);
	}
}
