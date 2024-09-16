import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogRef, MD_DIALOG_REF } from '../../dialog.service';

@Component({
	selector: 'md-dialog-footer',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog-footer.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogFooterComponent implements OnInit {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	ngOnInit(): void {
		console.log('MDDialogFooterComponent initialized', this._dialogRef);
	}
}
