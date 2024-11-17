import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { MDPopupComponent, PopupPositionType } from '@melodic-ui';

@Component({
	selector: 'app-custom-popup',
	standalone: true,
	imports: [CommonModule, MDPopupComponent],
	templateUrl: './custom-popup.component.html',
	styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent {
	public position: InputSignal<PopupPositionType> = input<PopupPositionType>('left-top');

	public isPopupClickawayDisabled: InputSignal<boolean> = input<boolean>(false);
}
