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
	WritableSignal,
	signal
} from '@angular/core';
import { MDOverlayComponent } from '../overlay/overlay.component';
import { MDDialogComponent } from './dialog.component';

export const MD_DIALOG_REF = new InjectionToken<DialogRef>('MD_DIALOG_REF');

export class DialogRef {
	public afterOpened: WritableSignal<boolean>;
	public afterClosed: WritableSignal<boolean>;
	public afterAllClosed: WritableSignal<boolean> = signal<boolean>(false);

	constructor(
		private _dialog: ComponentRef<MDOverlayComponent>,
		private _dialogService: DialogService
	) {
		this.afterOpened = _dialog.instance.afterOpened;
		this.afterClosed = _dialog.instance.afterClosed;
	}

	public closeAll(): void {
		this._dialogService.closeAll();
		this.afterAllClosed.set(true);
	}

	public close(): void {
		this._dialogService.close(this._dialog);
	}
}

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	private _appRef: ApplicationRef = inject(ApplicationRef);

	private _dialogs: ComponentRef<MDOverlayComponent>[] = [];

	public open<T extends Type<Component>>(component: T, inputs: { [key: string]: Signal<unknown> } = {}): DialogRef {
		const overlayComponentRef = this.createOverlayComponent();
		const dialogComponentRef = this.createDialogComponent(overlayComponentRef);
		const dialogRef = this.createProvidedComponent(overlayComponentRef, dialogComponentRef, component, inputs);

		this._dialogs.push(overlayComponentRef);

		return dialogRef;
	}

	public close(dialog: ComponentRef<MDOverlayComponent>) {
		dialog.destroy();
		this._dialogs = this._dialogs.filter((d) => d !== dialog);
	}

	public closeAll(): void {
		this._dialogs.forEach((dialog) => dialog.destroy());
		this._dialogs = [];
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

	private createDialogComponent(overlayComponent: ComponentRef<MDOverlayComponent>): ComponentRef<MDDialogComponent> {
		const dialogComponentRef: ComponentRef<MDDialogComponent> = createComponent(MDDialogComponent, {
			environmentInjector: this._appRef.injector
		});

		this._appRef.attachView(dialogComponentRef.hostView);
		overlayComponent.location.nativeElement.appendChild(dialogComponentRef.location.nativeElement);

		return dialogComponentRef;
	}

	private createProvidedComponent<T extends Type<Component>>(
		overlayComponentRef: ComponentRef<MDOverlayComponent>,
		dialogComponentRef: ComponentRef<MDDialogComponent>,
		component: T,
		inputs: { [key: string]: Signal<unknown> } = {}
	): DialogRef {
		const dialogRef = new DialogRef(overlayComponentRef, this);

		const dialogInjector = Injector.create({
			providers: [{ provide: MD_DIALOG_REF, useValue: dialogRef }]
		});

		dialogComponentRef.setInput('component', component);
		dialogComponentRef.setInput('inputs', inputs);
		dialogComponentRef.setInput('injector', dialogInjector);

		return dialogRef;
	}
}
