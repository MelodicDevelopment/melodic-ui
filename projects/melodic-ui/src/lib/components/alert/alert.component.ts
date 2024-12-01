import { Component, input, InputSignal } from '@angular/core';
import { IInternalAlert } from './interfaces/iinternal-alert.interface';
import { MDAlertService } from './alert.service';
import { MDIconComponent } from '../icon/icon.component';
import { MDStatusIconComponent } from '../status-icon/status-icon.component';

@Component({
	selector: 'md-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.components.scss'],
	standalone: true,
	imports: [MDIconComponent, MDStatusIconComponent]
})
export class MDAlertComponent {
	public alerts: InputSignal<IInternalAlert[]> = input.required();

	constructor(private alertService: MDAlertService) {}

	dismiss(id: string, action: 'dismissed' | 'action-taken' = 'dismissed'): void {
		this.alertService.removeAlert(id, action);
	}

	action(id: string, actionFn: () => void): void {
		actionFn();
		this.dismiss(id, 'action-taken');
	}
}
