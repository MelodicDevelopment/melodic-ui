import {
	Component,
	ElementRef,
	HostListener,
	inject,
	input,
	InputSignal,
	signal,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

export type PopupTriggerType = 'click' | 'hover';
export type PopupPositionType =
	| 'left'
	| 'left-top'
	| 'left-bottom'
	| 'right'
	| 'right-top'
	| 'right-bottom'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end';
export type PopupOffsetType = { x?: number; y?: number };

@Component({
	selector: 'md-popup',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './popup.component.html',
	styleUrl: './popup.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDPopupComponent {
	@ViewChild('popupContent', { static: true })
	private _popupContent!: TemplateRef<any>;

	private _overlay: Overlay = inject(Overlay);
	private _elementRef: ElementRef = inject(ElementRef);
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _overlayRef: OverlayRef | null = null;
	private _active: boolean = false;

	private _positions: { [key in PopupPositionType]: any } = {
		'left': { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -4, offsetY: 0 },
		'left-top': { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4, offsetY: -16 },
		'left-bottom': { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -4, offsetY: 16 },
		'right': { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 4, offsetY: 0 },
		'right-top': { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4, offsetY: -16 },
		'right-bottom': { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 4, offsetY: 16 },
		'top': { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetX: 0, offsetY: -4 },
		'top-start': { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetX: 0, offsetY: -4 },
		'top-end': { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetX: 0, offsetY: -4 },
		'bottom': { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetX: 0, offsetY: 4 },
		'bottom-start': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetX: 0, offsetY: 4 },
		'bottom-end': { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetX: 0, offsetY: 4 }
	};

	public trigger: InputSignal<PopupTriggerType> = input<PopupTriggerType>('click');
	public position: InputSignal<PopupPositionType> = input<PopupPositionType>('bottom');
	public offsets: InputSignal<PopupOffsetType> = input<PopupOffsetType>({});
	public arrow: InputSignal<boolean> = input<boolean>(true);
	public visible: WritableSignal<boolean> = signal<boolean>(false);
	public disableClickaway: InputSignal<boolean> = input<boolean>(false);

	@HostListener('document:click', ['$event'])
	outsideClick(event: MouseEvent) {
		if (!this.disableClickaway() && this.trigger() === 'click' && this.isEventOutside(event)) {
			this.hide();
		}
	}

	click(): void {
		if (this.trigger() === 'click') {
			if (this._active) {
				this.hide();
			} else {
				this.show();
			}
		}
	}

	mouseOver(): void {
		if (this.trigger() === 'hover') {
			this.show();
		}
	}

	mouseOut(): void {
		if (this.trigger() === 'hover') {
			this.hide();
		}
	}

	private show(): void {
		if (this._active) {
			return;
		}

		const positionStrategy: PositionStrategy = this._overlay
			.position()
			.flexibleConnectedTo(this._elementRef)
			.withPositions([
				{
					...this._positions[this.position()],
					offsetX: this.offsets().x || this._positions[this.position()].offsetX,
					offsetY: this.offsets().y || this._positions[this.position()].offsetY
				}
			]);

		this._overlayRef = this._overlay.create({
			positionStrategy,
			hasBackdrop: false,
			backdropClass: ''
		});

		const portal = new TemplatePortal(this._popupContent, this._viewContainerRef);
		this._overlayRef.attach(portal);

		this._active = true;
	}

	private hide(): void {
		if (this._overlayRef) {
			this._overlayRef.detach();
			this._overlayRef = null;

			this._active = false;
		}
	}

	private isEventOutside(event: MouseEvent): boolean {
		return !(this._elementRef.nativeElement as HTMLElement).contains(event.target as HTMLElement);
	}
}
