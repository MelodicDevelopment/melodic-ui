import { Injectable, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { INotification } from './interfaces/inotification.interface';
import { NotificationComponent } from './notification.component';
import { IInternalNotification } from './interfaces/iinternal-notification.interface';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	private notifications: IInternalNotification[] = [];
	private overlayRef: OverlayRef | null = null;
	private componentRef: ComponentRef<NotificationComponent> | null = null;

	constructor(private overlay: Overlay) {}

	addNotification(notification: INotification): string {
		const id = Math.random().toString(36).substr(2, 9);
		const notificationWithID = { ...notification, id };
		this.notifications.push(notificationWithID);
		this.attachComponent();

		if (notificationWithID.duration) {
			setTimeout(() => this.removeNotification(notificationWithID.id), notificationWithID.duration);
		}

		return id;
	}

	removeNotification(id: string): void {
		this.notifications = this.notifications.filter((n) => n.id !== id);
		this.updateComponent();

		if (this.notifications.length === 0) {
			this.detachComponent();
		}
	}

	private attachComponent(): void {
		if (!this.overlayRef) {
			this.overlayRef = this.overlay.create({
				positionStrategy: this.overlay.position().global().bottom('20px').right('20px'),
				panelClass: 'notification-container',
				hasBackdrop: false
			});
		}

		if (!this.componentRef) {
			const portal = new ComponentPortal(NotificationComponent);
			this.componentRef = this.overlayRef.attach(portal);
			this.updateComponent();
		}
	}

	private detachComponent(): void {
		if (this.overlayRef && this.componentRef) {
			this.overlayRef.detach();
			this.componentRef.destroy();
			this.componentRef = null;
		}
	}

	private updateComponent(): void {
		if (this.componentRef) {
			this.componentRef.instance.notifications = this.notifications;
		}
	}
}
