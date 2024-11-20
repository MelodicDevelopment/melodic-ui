import { Component, Directive, ElementRef, HostListener, inject, input, InputSignal, Type, ViewContainerRef } from '@angular/core';
import { MDToolTipComponent } from './tooltip.component';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopupPositionType } from '../popup/popup.component';

@Directive({
	standalone: true,
	selector: '[md-tooltip]'
})
export class MDToolTipDirective {
	private _elementRef: ElementRef = inject(ElementRef);
	private _overlay: Overlay = inject(Overlay);

	private _overlayRef: OverlayRef | null = null;

	private _positions: { [key in PopupPositionType]: any } = {
		'left': { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -4 },
		'left-top': { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
		'left-bottom': { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4 },
		'right': { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 4 },
		'right-top': { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
		'right-bottom': { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4 },
		'top': { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
		'top-start': { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
		'top-end': { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
		'bottom': { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
		'bottom-start': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
		'bottom-end': { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 }
	};

	public toolTip: InputSignal<string | Type<Component>> = input.required<string | Type<Component>>({ alias: 'md-tooltip' });
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

		const positionStrategy = this._overlay.position().flexibleConnectedTo(this._elementRef).withPositions(Object.values(this._positions));

		this._overlayRef = this._overlay.create({
			positionStrategy,
			hasBackdrop: false,
			backdropClass: ''
		});

		const tooltipComponent = new ComponentPortal(MDToolTipComponent);
		const tooltipComponentRef = this._overlayRef.attach(tooltipComponent);

		if (typeof this.toolTip() === 'string') {
			tooltipComponentRef.setInput('tooltipText', this.toolTip());
		} else {
			tooltipComponentRef.setInput('tooltipComponent', this.toolTip());
		}

		tooltipComponentRef.setInput('tooltipTitle', this.toolTipTitle());

		positionStrategy.positionChanges.subscribe((event) => {
			const chosenPosition = Object.keys(this._positions).find((key) => {
				return (
					this._positions[key as PopupPositionType].originX === event.connectionPair.originX &&
					this._positions[key as PopupPositionType].originY === event.connectionPair.originY
				);
			});

			tooltipComponentRef.location.nativeElement.classList = '';
			tooltipComponentRef.location.nativeElement.classList.add(chosenPosition);
		});
	}

	hide(): void {
		if (this._overlayRef) {
			this._overlayRef.detach();
		}
	}
}
