import { Component, ComponentRef, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
	selector: 'md-overlay',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './overlay.component.scss'
})
export class MDOverlayComponent implements OnInit, OnDestroy {
	public afterOpened: Subject<void> = new Subject<void>();
	public afterClosed: Subject<void> = new Subject<void>();

	public innerComponentRef: InputSignal<ComponentRef<Component>> = input.required<ComponentRef<Component>>();

	ngOnInit(): void {
		this.afterOpened.next();
	}

	ngOnDestroy(): void {
		this.afterClosed.next();
	}
}
