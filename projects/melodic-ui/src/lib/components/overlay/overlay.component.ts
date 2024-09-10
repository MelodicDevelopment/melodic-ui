import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-overlay',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './overlay.component.scss'
})
export class MDOverlayComponent implements OnInit, OnDestroy {
	ngOnInit(): void {
		debugger;
	}

	ngOnDestroy(): void {
		debugger;
	}
}
