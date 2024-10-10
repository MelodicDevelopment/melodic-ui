import { Component, effect, ElementRef, HostListener, inject, input, InputSignal, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

type TriggerType = 'click' | 'hover';
type PositionType = 'left' | 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left';
type OffsetType = { top?: number; right?: number; bottom?: number; left?: number };

// possible future improvement: check if the popup is outside the viewport and adjust the position accordingly
// https://chatgpt.com/share/6707bedf-6b60-8012-baef-e03dbcc62411

@Component({
	selector: 'md-popup',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDPopupComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public trigger: InputSignal<TriggerType> = input<TriggerType>('click');
	public position: InputSignal<PositionType> = input<PositionType>('bottom');
	public offsets: InputSignal<OffsetType> = input<OffsetType>({ top: 0, left: 0, right: 0, bottom: 0 });
	public visible: WritableSignal<boolean> = signal<boolean>(false);

	constructor() {
		effect(() => {
			const offsets = this.offsets();
			this.setCssValue('--md-popup-offset-top', (offsets.top || 0) + 'px');
			this.setCssValue('--md-popup-offset-right', (offsets.right || 0) + 'px');
			this.setCssValue('--md-popup-offset-bottom', (offsets.bottom || 0) + 'px');
			this.setCssValue('--md-popup-offset-left', (offsets.left || 0) + 'px');
		});
	}

	@HostListener('document:click', ['$event'])
	outsideClick(event: MouseEvent) {
		if (this.trigger() === 'click' && this.isEventOutside(event)) {
			this.visible.set(!this.visible);
		}
	}

	click(): void {
		if (this.trigger() === 'click') {
			this.visible.set(!this.visible());
		}
	}

	mouseOver(): void {
		if (this.trigger() === 'hover') {
			this.visible.set(true);
		}
	}

	mouseOut(): void {
		if (this.trigger() === 'hover') {
			this.visible.set(false);
		}
	}

	private isEventOutside(event: MouseEvent): boolean {
		return !(this._elementRef.nativeElement as HTMLElement).contains(event.target as HTMLElement);
	}

	private setCssValue(propertyName: string, value: string): void {
		(this._elementRef.nativeElement as HTMLElement).style.setProperty(propertyName, value);
	}
}
