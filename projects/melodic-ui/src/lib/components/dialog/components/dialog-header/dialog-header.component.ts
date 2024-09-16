import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogRef, MD_DIALOG_REF } from '../../dialog.service';

@Component({
	selector: 'md-dialog-header',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog-header.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogHeaderComponent implements OnInit {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	ngOnInit(): void {
		console.log('MDDialogHeaderComponent initialized', this._dialogRef);
	}
}
