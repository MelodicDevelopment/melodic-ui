import { Directive, ElementRef, HostListener, inject, input, InputSignal, ViewContainerRef } from '@angular/core';
import { MDToolTipComponent } from './tooltip.component';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
	standalone: true,
	selector: '[md-tooltip]'
})
export class MDToolTipDirective {
	private _elementRef: ElementRef = inject(ElementRef);
	private _overlay: Overlay = inject(Overlay);

	private _overlayRef: OverlayRef | null = null;

	public toolTip: InputSignal<string> = input.required<string>({ alias: 'md-tooltip' });
	public toolTipTitle: InputSignal<string | undefined> = input<string | undefined>(undefined, { alias: 'md-tooltip-title' });
	public delay: InputSignal<number> = input<number>(300, { alias: 'md-tooltip-delay' }); // Default delay of 300ms
	public disabled: InputSignal<boolean> = input<boolean>(false, { alias: 'md-tooltip-disabled' });

	@HostListener('mouseover')
	onMouseOver(): void {
		if (this.disabled()) {
			return;
		}

		setTimeout(() => {
			this.show();
		}, this.delay());
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		if (this.disabled()) {
			return;
		}

		setTimeout(() => {
			this.hide();
		}, this.delay());
	}

	show(): void {
		this.hide();

		const positionStrategy: PositionStrategy = this._overlay
			.position()
			.flexibleConnectedTo(this._elementRef)
			.withPositions([
				// bottom aligned
				{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
				{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },

				// top aligned
				{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: 4 },
				{ originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: 4 },

				// left aligned
				{ originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: 4 },
				{ originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: 4 },

				// right aligned
				{ originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
				{ originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 }
			]);

		this._overlayRef = this._overlay.create({
			positionStrategy,
			hasBackdrop: false,
			backdropClass: ''
		});

		const tooltipComponent = new ComponentPortal(MDToolTipComponent);
		const tooltipComponentRef = this._overlayRef.attach(tooltipComponent);
		tooltipComponentRef.setInput('tooltipText', this.toolTip());
		tooltipComponentRef.setInput('tooltipTitle', this.toolTipTitle());
	}

	hide(): void {
		if (this._overlayRef) {
			this._overlayRef.detach();
		}
	}
}
