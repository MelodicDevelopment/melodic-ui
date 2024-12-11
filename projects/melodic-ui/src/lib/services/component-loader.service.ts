import { Component, computed, Injectable, Signal, signal, Type, WritableSignal } from '@angular/core';

export type LoadableComponent = {
	component: WritableSignal<Type<Component> | null>;
	inputs: WritableSignal<Record<string, unknown>>;
};

@Injectable({
	providedIn: 'root'
})
export class ComponentLoaderService {
	private _readyContainers: WritableSignal<string[]> = signal<string[]>([]);

	public containers: { [key: string]: LoadableComponent } = {};

	public hasContainer = (key: string): Signal<boolean> => computed(() => this._readyContainers().includes(key));

	addContainer(key: string): LoadableComponent {
		this.containers[key] = {
			component: signal<Type<Component> | null>(null),
			inputs: signal<Record<string, unknown>>({})
		};

		this._readyContainers.set([...this._readyContainers(), key]);

		return this.containers[key];
	}

	getContainer(key: string): LoadableComponent {
		return this.containers[key];
	}

	removeContainer(key: string): void {
		delete this.containers[key];
		this._readyContainers.set(this._readyContainers().filter((k) => k !== key));
	}
}
