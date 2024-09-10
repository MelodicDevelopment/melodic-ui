import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ComponentRef, inject } from '@angular/core';
import { DialogService, MD_DIALOG_REF } from '@melodic-ui/components/dialog/dialog.service';
import { MDOverlayComponent } from '@melodic-ui/components/overlay/overlay.component';

@Component({
	selector: 'app-test-dialog-one',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './test-dialog-one.component.html',
	styleUrl: './test-dialog-one.component.scss'
})
export class TestDialogOneComponent {
	private _dialogService: DialogService = inject(DialogService);
	private _dialogRef: ComponentRef<MDOverlayComponent> = inject(MD_DIALOG_REF);

	close(): void {
		this._dialogService.close(this._dialogRef);
		//this._dialogRef.destroy();
	}
}
