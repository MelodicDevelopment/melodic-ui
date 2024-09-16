import { Component, Host, inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogRef, MD_DIALOG_REF } from '../../dialog.service';
import { MDDialogComponent } from '../../dialog.component';
import { MDIconComponent } from '../../../icon/icon.component';

@Component({
	selector: 'md-dialog-header',
	standalone: true,
	imports: [CommonModule, MDIconComponent],
	templateUrl: './dialog-header.component.html',
	styleUrl: './dialog-header.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogHeaderComponent implements OnInit {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	constructor(@Host() @Optional() private _dialogComponent: MDDialogComponent) {
		if (!this._dialogComponent) {
			console.error('The md-dialog-header component must be used within an md-dialog component');
		}
	}

	ngOnInit(): void {
		console.log('MDDialogHeaderComponent initialized', this._dialogRef);
	}

	close(): void {
		this._dialogRef.close();
	}
}
