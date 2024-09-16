import { Component, Host, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogComponent } from '../../dialog.component';

@Component({
	selector: 'md-dialog-footer',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog-footer.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogFooterComponent {
	constructor(@Host() @Optional() private _dialogComponent: MDDialogComponent) {
		if (!this._dialogComponent) {
			console.error('The md-dialog-footer component must be used within an md-dialog component');
		}
	}
}
