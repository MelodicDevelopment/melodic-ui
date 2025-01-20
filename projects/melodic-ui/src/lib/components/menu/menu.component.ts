import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, Input, InputSignal, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { MDPopupComponent } from '../popup/popup.component';
import { RouterModule } from '@angular/router';
import { IconRef } from '../../types/icon-ref.type';

type actionGetter = (item: unknown) => unknown;

export interface IMDMenuOption {
	label: string;
	icon?: IconRef;
	link?: string;
	linkTarget?: string;
	isRouteLink?: boolean;
	click?: actionGetter;
	class?: string;
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
	public triggerIcon: InputSignal<IconRef> = input<IconRef>('keyboard_arrow_down');

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
