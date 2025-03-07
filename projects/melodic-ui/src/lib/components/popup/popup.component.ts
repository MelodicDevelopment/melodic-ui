import {
	Component,
	ElementRef,
	inject,
	input,
	InputSignal,
	NgZone,
	OnDestroy,
	output,
	OutputEmitterRef,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollable, Overlay, OverlayRef, PositionStrategy, ScrollDispatcher, ScrollStrategyOptions } from '@angular/cdk/overlay';
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
export class MDPopupComponent implements OnDestroy {
	@ViewChild('popupContent', { static: true })
	private _popupContentTemplate!: TemplateRef<any>;

	private _popupContent: HTMLElement | undefined = undefined;

	private _overlay: Overlay = inject(Overlay);
	private _elementRef: ElementRef = inject(ElementRef);
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _scrollDispatcher: ScrollDispatcher = inject(ScrollDispatcher);
	private _ngZone: NgZone = inject(NgZone);

	private _overlayRef: OverlayRef | null = null;
	private _active: boolean = false;
	private _destroyed: boolean = false;
	private _outsideClickRef = (event: Event) => this.outsideClick(event);

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
	public popupClass: InputSignal<string> = input<string>('');
	public offsets: InputSignal<PopupOffsetType> = input<PopupOffsetType>({});
	public arrow: InputSignal<boolean> = input<boolean>(true);
	public disabled: InputSignal<boolean> = input<boolean>(false);
	public scrollStrategy: InputSignal<'reposition' | 'close' | 'block' | 'noop'> = input<'reposition' | 'close' | 'block' | 'noop'>('reposition');
	public scrollContainer: InputSignal<ElementRef | undefined> = input<ElementRef>();

	public disableClickaway: InputSignal<boolean> = input<boolean>(false);

	public onOpen: OutputEmitterRef<HTMLElement> = output<HTMLElement>();
	public onClose: OutputEmitterRef<void> = output<void>();

	ngOnDestroy(): void {
		this._destroyed = true;
	}

	public click(): void {
		if (this.disabled()) {
			return;
		}

		if (this.trigger() === 'click') {
			if (this._active) {
				this.hide();
			} else {
				this.show();
			}
		}
	}

	public mouseOver(): void {
		if (this.disabled()) {
			return;
		}

		if (this.trigger() === 'hover') {
			this.show();
		}
	}

	public mouseOut(): void {
		if (this.disabled()) {
			return;
		}

		if (this.trigger() === 'hover') {
			this.hide();
		}
	}

	public show(): void {
		if (this._active) {
			return;
		}

		const documentElementRef = new ElementRef<HTMLElement>(document.documentElement);

		const scrollableContainers: CdkScrollable[] = [this.registerScrollableElement(documentElementRef)];
		if (this.scrollContainer()) {
			scrollableContainers.push(this.registerScrollableElement(this.scrollContainer() as ElementRef));
		}

		const positionStrategy: PositionStrategy = this._overlay
			.position()
			.flexibleConnectedTo(this._elementRef)
			.withScrollableContainers(scrollableContainers)
			.withPositions([
				{
					...this._positions[this.position()],
					offsetX: this.offsets().x || this._positions[this.position()].offsetX,
					offsetY: this.offsets().y || this._positions[this.position()].offsetY
				}
			]);

		const scrollStrategy = this._overlay.scrollStrategies[this.scrollStrategy()]();

		this._overlayRef = this._overlay.create({
			positionStrategy,
			scrollStrategy,
			hasBackdrop: false,
			backdropClass: ''
		});

		const portal = new TemplatePortal(this._popupContentTemplate, this._viewContainerRef);
		this._overlayRef.attach(portal);

		this._active = true;

		this._popupContent = this._overlayRef.hostElement.querySelector('div.md-popup-content') as HTMLElement;
		this.onOpen.emit(this._popupContent);

		setTimeout(() => {
			document.addEventListener('click', this._outsideClickRef);
		}, 100); // delay to prevent immediate closing
	}

	public hide(): void {
		if (this._overlayRef) {
			if (!this._destroyed) {
				this.onClose.emit();
			}

			this._overlayRef.detach();
			this._overlayRef = null;

			this._active = false;

			this._popupContent = undefined;
			document.removeEventListener('click', this._outsideClickRef);
		}
	}

	private outsideClick(event: Event): void {
		if (this._active && !this.disableClickaway() && this.trigger() === 'click' && this.isEventOutside(event)) {
			this.hide();
		}
	}

	private isEventOutside(event: Event): boolean {
		return !(this._popupContent as HTMLElement).contains(event.target as HTMLElement);
	}

	private registerScrollableElement(elementRef: ElementRef): CdkScrollable {
		const scrollable = new CdkScrollable(elementRef, this._scrollDispatcher, this._ngZone);
		this._scrollDispatcher.register(scrollable);
		return scrollable;
	}
}
