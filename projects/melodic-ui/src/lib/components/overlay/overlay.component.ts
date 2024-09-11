import { Component, ComponentRef, input, InputSignal, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
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

	public innerComponentRef: InputSignal<ComponentRef<Component>> = input.required<ComponentRef<Component>>();

	ngOnInit(): void {
		this.afterOpened.set(true);
		this.afterClosed.set(false);
	}

	ngOnDestroy(): void {
		this.afterOpened.set(false);
		this.afterClosed.set(true);
	}
}
