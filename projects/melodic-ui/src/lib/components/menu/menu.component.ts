import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, Input, InputSignal, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { MDPopupComponent } from '../popup/popup.component';
import { RouterModule } from '@angular/router';

type actionGetter = (item: unknown) => unknown;

export interface IMDMenuOption {
	label: string;
	icon?: string;
	link?: string;
	linkTarget?: string;
	isRouteLink?: boolean;
	click?: actionGetter;
}

@Component({
	selector: 'md-menu',
	standalone: true,
	imports: [CommonModule, RouterModule, MDPopupComponent, MDIconComponent],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDMenuComponent implements AfterViewInit {
	private _elementRef: ElementRef = inject(ElementRef);

	public menuItems: InputSignal<IMDMenuOption[]> = input.required();
	public closeOnAction: InputSignal<boolean> = input(true);
	public menuItemComponent: InputSignal<Type<Component> | undefined> = input();

	ngAfterViewInit(): void {
		const element: HTMLElement = this._elementRef.nativeElement as HTMLElement;
		const attributes = element.getAttributeNames().filter((attr) => attr.startsWith('md-button'));

		if (attributes.length === 0) {
			attributes.push('md-button-brand');
		}

		const popupTriggerButton = element.querySelector('.md-popup-trigger button') as HTMLElement;
		attributes.forEach((attr) => {
			popupTriggerButton.setAttribute(attr, '');
		});
	}

	public closeMenu(popupComponent: MDPopupComponent): void {
		if (this.closeOnAction()) {
			popupComponent.hide();
		}
	}
}
