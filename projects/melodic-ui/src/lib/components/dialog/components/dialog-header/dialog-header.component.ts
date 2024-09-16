import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogRef, MD_DIALOG_REF } from '../../dialog.service';
import { MDIconComponent } from '../../../icon/icon.component';

@Component({
	selector: 'md-dialog-header',
	standalone: true,
	imports: [CommonModule, MDIconComponent],
	templateUrl: './dialog-header.component.html',
	styleUrl: './dialog-header.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogHeaderComponent {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	close(): void {
		this._dialogRef.close();
	}
}
