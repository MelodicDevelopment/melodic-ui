import { Component, Injector, input, InputSignal, OnDestroy, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-dialog',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-container *ngComponentOutlet="component(); inputs: inputs(); injector: injector() "></ng-container>',
	styleUrl: './dialog.component.scss'
})
export class MDDialogComponent implements OnInit, OnDestroy {
	public component: InputSignal<Type<Component>> = input.required<Type<Component>>();
	public inputs: InputSignal<{ [key: string]: InputSignal<unknown> }> = input<{ [key: string]: InputSignal<unknown> }>({});
	public injector: InputSignal<Injector> = input.required<Injector>();

	ngOnInit(): void {
		console.log('MDDialogComponent.ngOnInit()');
	}

	ngOnDestroy(): void {
		console.log('MDDialogComponent.ngOnDestroy()');
	}
}
