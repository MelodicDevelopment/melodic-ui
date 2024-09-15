import { Component, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContentBoxType = 'default' | 'brand' | 'info' | 'success' | 'warning' | 'error';

@Component({
	selector: 'md-content-box',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './content-box.component.scss'
})
export class MDContentBoxComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public type: InputSignal<ContentBoxType> = input<ContentBoxType>('default');

	constructor() {
		effect(() => {
			this._elementRef.nativeElement.classList.add(this.type());
		});
	}
}
