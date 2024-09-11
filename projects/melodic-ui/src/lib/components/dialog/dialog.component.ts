import { Component, ComponentRef, input, InputSignal, OnDestroy, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-dialog',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog.component.scss'
})
export class MDDialogComponent implements OnInit, OnDestroy {
	public providedComponentRef: InputSignal<ComponentRef<Component>> = input.required<ComponentRef<Component>>();

	ngOnInit(): void {
		console.log('MDDialogComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		console.log('MDDialogComponent.ngOnDestroy()');
	}
}
