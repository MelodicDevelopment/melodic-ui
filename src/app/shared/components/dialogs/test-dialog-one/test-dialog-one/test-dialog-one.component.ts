import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { MDDialogRef, MD_DIALOG_REF, MDDialogModule, MDDatePickerInputDirective, MDMenuComponent, IMDMenuOption } from '@melodic-ui';
import { TestDialogOneInnerComponent } from './test-dialog-one-inner.component';

@Component({
	selector: 'app-test-dialog-one',
	standalone: true,
	imports: [CommonModule, TestDialogOneInnerComponent, MDDialogModule, MDDatePickerInputDirective, MDMenuComponent],
	templateUrl: './test-dialog-one.component.html',
	styleUrl: './test-dialog-one.component.scss'
})
export class TestDialogOneComponent implements OnInit, OnDestroy {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	public seconds: InputSignal<number> = input<number>(3);

	@Input() testString: string = 'Test String';

	public menuOptions: IMDMenuOption[] = [
		{
			label: 'Menu Item 1',
			icon: 'home',
			click: (item: unknown) => {
				console.log('Menu item 1 clicked', item);
			}
		},
		{
			label: 'Menu Item 2',
			icon: 'favorite',
			click: (item: unknown) => {
				console.log('Menu item 2 clicked', item);
			}
		},
		{
			label: 'Menu Item 3',
			click: (item: unknown) => {
				console.log('Menu item 3 clicked', item);
			}
		},
		{
			label: 'Menu Item 4',
			link: 'https://www.google.com',
			linkTarget: '_blank'
		},
		{
			label: 'Menu Item 5',
			link: 'https://www.tiktok.com'
		}
	];

	ngOnInit(): void {
		console.log('TestDialogOneComponent.ngOnInit()');

		this._dialogRef.afterOpened.subscribe(() => {
			console.log('TestDialogOneComponent.afterOpened');
		});

		this._dialogRef.afterClosed.subscribe(() => {
			console.log('TestDialogOneComponent.afterClosed');
		});
	}

	ngOnDestroy(): void {
		console.log('TestDialogOneComponent.ngOnDestroy()');
	}

	close(): void {
		this._dialogRef.close();
	}
}
