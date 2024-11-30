import { Component, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorType, indicatorTypes } from '../../types/indicator-type.type';

@Component({
	selector: 'md-content-box',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './content-box.component.scss'
})
export class MDContentBoxComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public type: InputSignal<IndicatorType> = input<IndicatorType>('default');

	constructor() {
		effect(() => {
			const contentBoxTypes = indicatorTypes;
			this._elementRef.nativeElement.classList.remove(...contentBoxTypes);

			this._elementRef.nativeElement.classList.add(this.type());
		});
	}
}
