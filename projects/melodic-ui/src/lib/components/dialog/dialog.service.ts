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
import { Subject } from 'rxjs';

export const MD_DIALOG_REF = new InjectionToken<MDDialogRef>('MD_DIALOG_REF');

export class MDDialogRef {
	public afterOpened: Subject<void> = new Subject<void>();
	public afterClosed: Subject<void> = new Subject<void>();
	public afterAllClosed: Subject<void> = new Subject<void>();

	constructor(
		private _overlayComponentRef: ComponentRef<MDOverlayComponent>,
		private _dialogService: MDDialogService
	) {
		this.afterOpened = _overlayComponentRef.instance.afterOpened;
		this.afterClosed = _overlayComponentRef.instance.afterClosed;
	}

	public closeAll(): void {
		this._dialogService.closeAll();
		this.afterAllClosed.next();
	}

	public close(): void {
		this._dialogService.close(this._overlayComponentRef);
	}
}

@Injectable({
	providedIn: 'root'
})
export class MDDialogService {
	private _appRef: ApplicationRef = inject(ApplicationRef);

	private _dialogs: ComponentRef<MDOverlayComponent>[] = [];

	public open<T extends Type<Component>>(component: T, inputs: { [key: string]: unknown } = {}): MDDialogRef {
		const overlayComponentRef = this.createOverlayComponent();
		const providedComponentRefWithDialogRef = this.createProvidedComponent(overlayComponentRef, component, inputs);

		this._dialogs.push(overlayComponentRef);

		return providedComponentRefWithDialogRef.dialogRef;
	}

	public close(dialog: ComponentRef<MDOverlayComponent>) {
		dialog.instance.innerComponentRef().destroy();
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

	private createProvidedComponent<T extends Type<Component>>(
		overlayComponentRef: ComponentRef<MDOverlayComponent>,
		component: T,
		inputs: { [key: string]: unknown } = {}
	): { dialogRef: MDDialogRef; providedComponentRef: ComponentRef<Component> } {
		const dialogRef = new MDDialogRef(overlayComponentRef, this);

		const dialogInjector = Injector.create({
			providers: [{ provide: MD_DIALOG_REF, useValue: dialogRef }]
		});

		const innerComponentRef: ComponentRef<Component> = createComponent(component, {
			environmentInjector: this._appRef.injector,
			elementInjector: dialogInjector
		});

		Object.keys(inputs).forEach((key) => {
			innerComponentRef.setInput(key, inputs[key]);
		});

		this._appRef.attachView(innerComponentRef.hostView);
		overlayComponentRef.location.nativeElement.appendChild(innerComponentRef.location.nativeElement);

		overlayComponentRef.setInput('innerComponentRef', innerComponentRef);

		return { dialogRef, providedComponentRef: innerComponentRef };
	}
}
