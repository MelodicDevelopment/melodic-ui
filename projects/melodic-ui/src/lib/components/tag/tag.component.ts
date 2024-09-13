import { Component, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TagType = 'default' | 'brand' | 'info' | 'success' | 'warning' | 'error';

@Component({
	selector: 'md-tag',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag.component.html',
	styleUrl: './tag.component.scss'
})
export class MDTagComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public type: InputSignal<TagType> = input<TagType>('default');

	constructor() {
		effect(() => {
			this._elementRef.nativeElement.classList.add(this.type());
		});
	}
}
