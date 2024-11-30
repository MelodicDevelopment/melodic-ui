import { Component, inject, input, Input, InputSignal } from '@angular/core';
import { IInternalAlert } from './interfaces/iinternal-alert.interface';
import { MDAlertService } from './alert.service';
import { MDIconComponent } from '../icon/icon.component';
import { MDStatusIconComponent } from '../status-icon/status-icon.component';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'md-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.components.scss'],
	standalone: true,
	imports: [MDIconComponent, MDStatusIconComponent]
})
export class MDAlertComponent {
	private _router: Router = inject(Router);

	public alerts: InputSignal<IInternalAlert[]> = input.required();

	constructor(private alertService: MDAlertService) {}

	dismiss(id: string, action: 'dismissed' | 'action-taken' = 'dismissed'): void {
		this.alertService.removeAlert(id, action);
	}

	openLink(id: string, link: { text: string; url: string; routerLink: boolean }): void {
		if (link.routerLink) {
			this._router.navigateByUrl(link.url);
		} else {
			window.open(link.url, '_blank');
		}

		this.dismiss(id, 'action-taken');
	}
}
