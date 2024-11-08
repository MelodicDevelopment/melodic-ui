import { AfterContentInit, Component, ContentChild, QueryList, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDDialogHeaderDirective } from './directives/md-dialog-header.directive';
import { MDDialogFooterDirective } from './directives/md-dialog-footer.directive';

@Component({
	selector: 'md-dialog',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogComponent implements AfterContentInit {
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
}
