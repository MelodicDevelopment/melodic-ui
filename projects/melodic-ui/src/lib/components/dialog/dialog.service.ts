import {
	Injectable,
	ApplicationRef,
	Injector,
	Type,
	ComponentRef,
	createComponent,
	inject,
	Component,
	Signal,
	InjectionToken,
	WritableSignal
} from '@angular/core';
import { MDOverlayComponent } from '../overlay/overlay.component';
import { MDDialogComponent } from './dialog.component';

export const MD_DIALOG_REF = new InjectionToken<ComponentRef<MDOverlayComponent>>('MD_DIALOG_REF');

export class DialogRef {
	//public afterOpened: WritableSignal<void> = signal();

	constructor(
		private _dialog: ComponentRef<MDOverlayComponent>,
		private _dialogService: DialogService
	) {}

	closeAll(): void {
		this._dialogService.closeAll();
	}

	close(): void {
		this._dialog.destroy();
	}
}

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	private _appRef: ApplicationRef = inject(ApplicationRef);

	private _dialogs: ComponentRef<MDOverlayComponent>[] = [];

	public open<T extends Type<Component>>(component: T, inputs: { [key: string]: Signal<unknown> } = {}): ComponentRef<MDOverlayComponent> {
		const dialog = this.createOverlayComponent();
		const componentRef = this.createProvidedComponent(dialog, component, inputs);
		const dialogComponentRef = this.createDialogComponent(componentRef);

		this.addDialogToOverlay(dialog, dialogComponentRef);

		this._dialogs.push(dialog);

		return dialog;
	}

	public close(dialog: ComponentRef<MDOverlayComponent>) {
		dialog.destroy();
		this._dialogs = this._dialogs.filter((d) => d !== dialog);
	}

	public closeAll(): void {
		this._dialogs.forEach((dialog) => dialog.destroy());
		this._dialogs = [];
	}

	private addDialogToOverlay(dialog: ComponentRef<MDOverlayComponent>, dialogComponentRef: ComponentRef<MDDialogComponent>): void {
		dialog.location.nativeElement.appendChild(dialogComponentRef.location.nativeElement);
	}

	private createProvidedComponent<T extends Type<Component>>(
		dialog: ComponentRef<MDOverlayComponent>,
		component: T,
		inputs: { [key: string]: Signal<unknown> } = {}
	): ComponentRef<Component> {
		const dialogInjector = Injector.create({
			providers: [{ provide: MD_DIALOG_REF, useValue: dialog }]
		});

		const componentRef = createComponent(component, {
			environmentInjector: this._appRef.injector,
			elementInjector: dialogInjector
		});

		this._appRef.attachView(componentRef.hostView);

		Object.keys(inputs).forEach((key) => {
			componentRef.setInput(key, inputs[key]);
		});

		return componentRef;
	}

	private createDialogComponent(componentRef: ComponentRef<Component>): ComponentRef<MDDialogComponent> {
		const dialogComponentRef = createComponent(MDDialogComponent, {
			environmentInjector: this._appRef.injector,
			projectableNodes: [[componentRef.location.nativeElement]]
		});

		this._appRef.attachView(dialogComponentRef.hostView);

		return dialogComponentRef;
	}

	private createOverlayComponent(): ComponentRef<MDOverlayComponent> {
		const overlayComponentRef: ComponentRef<MDOverlayComponent> = createComponent(MDOverlayComponent, {
			environmentInjector: this._appRef.injector
		});

		this._appRef.attachView(overlayComponentRef.hostView);

		const domElem = (overlayComponentRef.hostView as any).rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);

		return overlayComponentRef;
	}
}
