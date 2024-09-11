import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DialogRef, MD_DIALOG_REF } from '@melodic-ui/components/dialog/dialog.service';
import { TestDialogOneInnerComponent } from './test-dialog-one-inner.component';

@Component({
	selector: 'app-test-dialog-one',
	standalone: true,
	imports: [CommonModule, TestDialogOneInnerComponent],
	templateUrl: './test-dialog-one.component.html',
	styleUrl: './test-dialog-one.component.scss'
})
export class TestDialogOneComponent implements OnInit, OnDestroy {
	private _dialogRef: DialogRef = inject(MD_DIALOG_REF);
	private _interval: number;

	public seconds: WritableSignal<number> = signal<number>(3);

	constructor() {
		effect(() => {
			console.log(this._dialogRef.afterOpened());
			console.log(this._dialogRef.afterClosed());
		});

		this._interval = window.setInterval(() => {
			console.log(this.seconds());
			this.seconds.set(this.seconds() - 1);

			if (this.seconds() === 0) {
				this.close();
			}
		}, 1000);
	}

	ngOnInit(): void {
		console.log('TestDialogOneComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		clearInterval(this._interval);
		console.log('TestDialogOneComponent.ngOnDestroy()');
	}

	close(): void {
		this._dialogRef.close();
	}
}
