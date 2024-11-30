import { Component, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorType, indicatorTypes } from '../../types/indicator-type.type';

@Component({
	selector: 'md-tag',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag.component.html',
	styleUrl: './tag.component.scss'
})
export class MDTagComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public type: InputSignal<IndicatorType> = input<IndicatorType>('default');

	constructor() {
		effect(() => {
			const tagTypes = indicatorTypes;
			(this._elementRef.nativeElement as HTMLElement).classList.remove(...tagTypes);

			(this._elementRef.nativeElement as HTMLElement).classList.add(this.type());
		});
	}
}
