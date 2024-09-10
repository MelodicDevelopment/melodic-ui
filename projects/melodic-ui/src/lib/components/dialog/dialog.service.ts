import { Injectable, ApplicationRef, Injector, Type, ComponentRef, createComponent, inject } from '@angular/core';
import { MDDialogComponent } from './dialog.component';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	private _appRef: ApplicationRef = inject(ApplicationRef);
	private _injector: Injector = inject(Injector);

	// Create the component using the new `createComponent` function
	private _componentRef: ComponentRef<MDDialogComponent> = createComponent(MDDialogComponent, {
		environmentInjector: this._appRef.injector
	});

	public injectComponent(): ComponentRef<any> {
		// Attach to the appRef so Angular can manage its lifecycle
		this._appRef.attachView(this._componentRef.hostView);

		// Get the HTML element from the component
		const domElem = (this._componentRef.hostView as any).rootNodes[0] as HTMLElement;

		// Append the element to the body (or any other element)
		document.body.appendChild(domElem);

		return this._componentRef;
	}

	// Optionally, you can also provide a method to destroy the component
	public destroyComponent() {
		this._appRef.detachView(this._componentRef.hostView);
		this._componentRef.destroy();
	}
}
