import { Injectable, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { IAlert } from './interfaces/ialert.interface';
import { MDAlertComponent } from './alert.component';
import { IInternalAlert } from './interfaces/iinternal-alert.interface';

@Injectable({
	providedIn: 'root'
})
export class MDAlertService {
	private alerts: IInternalAlert[] = [];
	private overlayRef: OverlayRef | null = null;
	private componentRef: ComponentRef<MDAlertComponent> | null = null;

	constructor(private overlay: Overlay) {}

	addAlert(alert: IAlert): string {
		const id = Math.random().toString(36).substr(2, 9);
		const alertWithID = { ...alert, id };
		this.alerts.push(alertWithID);
		this.attachComponent();

		if (alertWithID.duration) {
			setTimeout(() => this.removeAlert(alertWithID.id), alertWithID.duration);
		}

		return id;
	}

	removeAlert(id: string, action: 'dismissed' | 'action-taken' = 'dismissed'): void {
		const alert = this.alerts.find((n) => n.id === id);
		if (alert && alert.onClose) {
			alert.onClose(action);
		}

		this.alerts = this.alerts.filter((n) => n.id !== id);
		this.updateComponent();

		if (this.alerts.length === 0) {
			this.detachComponent();
		}
	}

	private attachComponent(): void {
		if (!this.overlayRef) {
			this.overlayRef = this.overlay.create({
				positionStrategy: this.overlay.position().global().top('20px').right('20px'),
				panelClass: 'alert-container',
				hasBackdrop: false
			});
		}

		if (!this.componentRef) {
			const portal = new ComponentPortal(MDAlertComponent);
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
			this.componentRef.setInput('alerts', this.alerts);
		}
	}
}
