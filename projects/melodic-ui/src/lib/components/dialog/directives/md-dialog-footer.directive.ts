import { Directive, ElementRef, Host, inject, Optional, ViewContainerRef } from '@angular/core';
import { MDDialogComponent } from '../dialog.component';
import { MDDialogFooterComponent } from '../components/dialog-footer/dialog-footer.component';

@Directive({
	standalone: true,
	selector: '[md-dialog-footer]'
})
export class MDDialogFooterDirective {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _footerContent: HTMLElement = this._elementRef.nativeElement;

	constructor(@Host() @Optional() private _dialogComponent: MDDialogComponent) {
		if (!this._dialogComponent) {
			console.error('The md-dialog-footer directive must be used within an md-dialog component');
		}
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const mdFooterComponentRef = this._viewContainerRef.createComponent<MDDialogFooterComponent>(MDDialogFooterComponent);

		const mdFooterComponent = mdFooterComponentRef.location.nativeElement as HTMLElement;
		mdFooterComponent.appendChild(this._footerContent);
	}
}
