import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-test-dialog-one-inner',
	standalone: true,
	imports: [CommonModule],
	template: '<div>Test Me</div>'
})
export class TestDialogOneInnerComponent implements OnInit, OnDestroy {
	ngOnInit(): void {
		console.log('TestDialogOneInnerComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		console.log('TestDialogOneInnerComponent.ngOnDestroy()');
	}
}
