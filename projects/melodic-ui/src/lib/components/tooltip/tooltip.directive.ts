import { ComponentRef, Directive, effect, HostListener, inject, input, InputSignal, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { MDToolTipComponent } from './tooltip.component';

@Directive({
	standalone: true,
	selector: '[md-tooltip]'
})
export class MDToolTipDirective {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _componentRef: ComponentRef<MDToolTipComponent> | undefined;

	public toolTip: InputSignal<string> = input.required<string>({ alias: 'md-tooltip' });
	public toolTipTitle: InputSignal<string | undefined> = input<string | undefined>(undefined, { alias: 'md-tooltip-title' });
	public delay: InputSignal<number> = input<number>(300, { alias: 'md-tooltip-delay' }); // Default delay of 100ms
	public disabled: InputSignal<boolean> = input<boolean>(false, { alias: 'md-tooltip-disabled' });

	@HostListener('mouseover')
	onMouseOver(): void {
		this.show();

		setTimeout(() => {
			if (!this._componentRef) {
				return;
			}

			(this._componentRef.location.nativeElement as HTMLElement).classList.add('active');
		}, this.delay());
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		if (!this._componentRef) {
			return;
		}

		(this._componentRef.location.nativeElement as HTMLElement).classList.remove('active');

		setTimeout(() => {
			this.hide();
		}, this.delay());
	}

	show(): void {
		this._viewContainerRef.clear();
		this._componentRef = this._viewContainerRef.createComponent<MDToolTipComponent>(MDToolTipComponent);
		this._componentRef.setInput('tooltipText', this.toolTip());
		this._componentRef.setInput('tooltipTitle', this.toolTipTitle());
	}

	hide(): void {
		this._viewContainerRef.clear();
	}
}
