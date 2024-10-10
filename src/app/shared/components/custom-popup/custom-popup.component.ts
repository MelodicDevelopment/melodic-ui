import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { MDPopupComponent } from '@melodic-ui';

type PositionType = 'left' | 'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left';

@Component({
	selector: 'app-custom-popup',
	standalone: true,
	imports: [CommonModule, MDPopupComponent],
	templateUrl: './custom-popup.component.html',
	styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent {
	public position: InputSignal<PositionType> = input<PositionType>('bottom-right');
}
