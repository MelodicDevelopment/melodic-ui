import { Component, effect, ElementRef, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TagType = 'default' | 'brand' | 'tertiary' | 'info' | 'success' | 'warning' | 'error';

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
			const tagTypes = ['default', 'brand', 'tertiary', 'info', 'success', 'warning', 'error'];
			(this._elementRef.nativeElement as HTMLElement).classList.remove(...tagTypes);

			(this._elementRef.nativeElement as HTMLElement).classList.add(this.type());
		});
	}
}
