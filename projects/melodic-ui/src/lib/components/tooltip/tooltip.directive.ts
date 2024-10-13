import {
	ComponentRef,
	Directive,
	effect,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	input,
	InputSignal,
	OnInit,
	signal,
	ViewContainerRef,
	WritableSignal
} from '@angular/core';
import { MDToolTipComponent } from './tooltip.component';

@Directive({
	standalone: true,
	selector: '[md-tooltip]'
})
export class MDToolTipDirective implements OnInit {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _componentRef: ComponentRef<MDToolTipComponent> | undefined;

	private _active: WritableSignal<boolean> = signal(false);

	public toolTip: InputSignal<string> = input.required<string>({ alias: 'md-tooltip' });
	public toolTipTitle: InputSignal<string | undefined> = input<string | undefined>(undefined, { alias: 'md-tooltip-title' });
	public delay: InputSignal<number> = input<number>(300, { alias: 'md-tooltip-delay' }); // Default delay of 300ms
	public disabled: InputSignal<boolean> = input<boolean>(false, { alias: 'md-tooltip-disabled' });

	@HostListener('mouseover')
	onMouseOver(): void {
		setTimeout(() => {
			this._active.set(true);
		}, this.delay());
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		setTimeout(() => {
			this._active.set(false);
		}, this.delay());
	}

	constructor() {
		effect(() => {
			if (this.disabled() && this._active()) {
				//this._componentRef?.hostView.
			}
		});
	}

	ngOnInit(): void {
		this._viewContainerRef.clear();
		this._componentRef = this._viewContainerRef.createComponent<MDToolTipComponent>(MDToolTipComponent);
		this._componentRef.setInput('tooltipText', this.toolTip());
		this._componentRef.setInput('tooltipTitle', this.toolTipTitle());
	}
}
