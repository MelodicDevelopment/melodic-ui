import { AfterContentInit, Component, ContentChild, ElementRef, inject, QueryList, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogHeaderDirective } from './directives/md-dialog-header.directive';
import { MDDialogFooterDirective } from './directives/md-dialog-footer.directive';
import { MD_DIALOG_REF, MDDialogRef } from './dialog.service';
import { MDIconComponent } from '../icon/icon.component';

@Component({
	selector: 'md-dialog',
	standalone: true,
	imports: [CommonModule, MDIconComponent],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss'
})
export class MDDialogComponent implements AfterContentInit {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	@ContentChild(MDDialogHeaderDirective) private _dialogHeader!: QueryList<MDDialogHeaderDirective | undefined>;
	@ContentChild(MDDialogFooterDirective) private _dialogFooter!: QueryList<MDDialogFooterDirective | undefined>;

	public hasHeader: WritableSignal<boolean> = signal<boolean>(false);
	public hasFooter: WritableSignal<boolean> = signal<boolean>(false);

	ngAfterContentInit(): void {
		if (this._dialogHeader) {
			this.hasHeader.set(true);
		}

		if (this._dialogFooter) {
			this.hasFooter.set(true);
		}
	}

	close(): void {
		this._dialogRef.close();
	}
}
