import { CommonModule } from '@angular/common';
import { Component, input, Input, InputSignal, ViewEncapsulation } from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { MDPopupComponent } from '../popup/popup.component';

type actionGetter = (item: unknown) => unknown;

export interface IMDMenuOption {
	label: string;
	icon?: string;
	link?: string;
	linkTarget?: string;
	click?: actionGetter;
}

@Component({
	selector: 'md-menu',
	standalone: true,
	imports: [CommonModule, MDPopupComponent, MDIconComponent],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDMenuComponent {
	public menuItems: InputSignal<IMDMenuOption[]> = input.required();
}
