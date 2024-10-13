import { ComponentRef, Directive, ElementRef, HostListener, inject, input, InputSignal, OnInit, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { MDToolTipComponent } from './tooltip.component';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
	standalone: true,
	selector: '[md-tooltip]'
})
export class MDToolTipDirective {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _overlayRef: OverlayRef | null = null;
	private _overlay: Overlay = inject(Overlay);

	public toolTip: InputSignal<string> = input.required<string>({ alias: 'md-tooltip' });
	public toolTipTitle: InputSignal<string | undefined> = input<string | undefined>(undefined, { alias: 'md-tooltip-title' });
	public delay: InputSignal<number> = input<number>(300, { alias: 'md-tooltip-delay' }); // Default delay of 300ms
	public disabled: InputSignal<boolean> = input<boolean>(false, { alias: 'md-tooltip-disabled' });

	@HostListener('mouseover', ['$event'])
	onMouseOver(event: MouseEvent): void {
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
		this.hide(); // Hide existing tooltip if any

		const parentPosition: DOMRect = this._viewContainerRef.element.nativeElement.getBoundingClientRect();
		const y: number = parentPosition.top + parentPosition.height + 5;
		const x: number = parentPosition.left;

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
