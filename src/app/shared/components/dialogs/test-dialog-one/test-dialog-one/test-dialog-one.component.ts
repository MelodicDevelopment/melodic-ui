import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { MDDialogRef, MD_DIALOG_REF, MDDialogModule } from '@melodic-ui';
import { TestDialogOneInnerComponent } from './test-dialog-one-inner.component';

@Component({
	selector: 'app-test-dialog-one',
	standalone: true,
	imports: [CommonModule, TestDialogOneInnerComponent, MDDialogModule],
	templateUrl: './test-dialog-one.component.html',
	styleUrl: './test-dialog-one.component.scss'
})
export class TestDialogOneComponent implements OnInit, OnDestroy {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);
	//private _interval: number;

	public seconds: InputSignal<number> = input<number>(3);

	@Input() testString: string = 'Test String';

	constructor() {
		effect(() => {
			console.log(this.seconds());
			console.log(this._dialogRef.afterOpened());
			console.log(this._dialogRef.afterClosed());
		});

		// this._interval = window.setInterval(() => {
		// 	this.seconds.set(this.seconds() - 1);

		// 	if (this.seconds() === 0) {
		// 		this.close();
		// 	}
		// }, 1000);
	}

	ngOnInit(): void {
		console.log('TestDialogOneComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		//clearInterval(this._interval);
		console.log('TestDialogOneComponent.ngOnDestroy()');
	}

	close(): void {
		this._dialogRef.close();
	}
}
