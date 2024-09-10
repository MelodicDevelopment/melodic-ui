import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DialogRef, MD_DIALOG_REF } from '@melodic-ui/components/dialog/dialog.service';

@Component({
	selector: 'app-test-dialog-one',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './test-dialog-one.component.html',
	styleUrl: './test-dialog-one.component.scss'
})
export class TestDialogOneComponent implements OnInit, OnDestroy {
	private _dialogRef: DialogRef = inject(MD_DIALOG_REF);
	private _interval: number = 0;

	public seconds: WritableSignal<number> = signal<number>(3);

	constructor() {
		effect(() => {
			console.log(this._dialogRef.afterOpened());
			console.log(this._dialogRef.afterClosed());
		});

		// setInterval(() => {
		// 	console.log(this.seconds());
		// 	this.seconds.set(this.seconds() - 1);
		// }, 1000);
	}

	ngOnInit(): void {
		console.log('TestDialogOneComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		debugger;
		clearInterval(this._interval);
		console.log('TestDialogOneComponent.ngOnDestroy()');
	}

	close(): void {
		this._dialogRef.close();
		//this._dialogService.close(this._dialogRef);
		//this._dialogRef.destroy();
	}
}
