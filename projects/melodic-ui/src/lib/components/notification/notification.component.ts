import { Component, Input } from '@angular/core';
import { IInternalNotification } from './interfaces/iinternal-notification.interface';
import { NotificationService } from './notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styles: [
		`
			.notification {
				margin: 10px 0;
				padding: 10px;
				border-radius: 4px;
				color: #fff;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.7);
				min-width: 200px;
				max-width: 300px;
			}
			.success {
				background-color: #4caf50;
			}
			.error {
				background-color: #f44336;
			}
			.info {
				background-color: #2196f3;
			}
			.warning {
				background-color: #ff9800;
			}
			button {
				background: none;
				border: none;
				color: #fff;
				font-size: 16px;
				cursor: pointer;
			}
		`
	]
})
export class NotificationComponent {
	@Input() notifications: IInternalNotification[] = [];

	constructor(private notificationService: NotificationService) {}

	dismiss(id: string): void {
		this.notificationService.removeNotification(id);
	}
}
