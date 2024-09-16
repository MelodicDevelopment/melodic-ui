import { Directive, ElementRef, Host, inject, Optional, ViewContainerRef } from '@angular/core';
import { MDDialogComponent } from '../dialog.component';
import { MDDialogHeaderComponent } from '../components/dialog-header/dialog-header.component';

@Directive({
	standalone: true,
	selector: '[md-dialog-header]'
})
export class MDDialogHeaderDirective {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _headerContent: HTMLElement = this._elementRef.nativeElement;

	constructor(@Host() @Optional() private _dialogComponent: MDDialogComponent) {
		if (!this._dialogComponent) {
			console.error('The md-dialog-header directive must be used within an md-dialog component');
		}
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const mdHeaderComponentRef = this._viewContainerRef.createComponent<MDDialogHeaderComponent>(MDDialogHeaderComponent);

		const mdHeaderComponent = mdHeaderComponentRef.location.nativeElement as HTMLElement;
		mdHeaderComponent.appendChild(this._headerContent);
	}
}
