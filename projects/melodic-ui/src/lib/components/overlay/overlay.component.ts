import { Component, input, InputSignal, OnDestroy, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-overlay',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './overlay.component.scss'
})
export class MDOverlayComponent implements OnInit, OnDestroy {
	public afterOpened: WritableSignal<boolean> = signal<boolean>(false);
	public afterClosed: WritableSignal<boolean> = signal<boolean>(false);

	ngOnInit(): void {
		this.afterOpened.set(true);
		this.afterClosed.set(false);
		console.log('MDOverlayComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		this.afterOpened.set(false);
		this.afterClosed.set(true);
		console.log('MDOverlayComponent.ngOnDestroy()');
	}
}
