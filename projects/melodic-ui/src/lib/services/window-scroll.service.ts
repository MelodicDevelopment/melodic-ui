// src/app/window-scroll.service.ts

import { Injectable, WritableSignal, signal, inject, computed, Signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent } from 'rxjs';
import { map, share } from 'rxjs/operators';

type WindowScrollPosition = { x: number; y: number };

@Injectable({ providedIn: 'root' })
export class WindowScrollService {
	private _document: Document = inject(DOCUMENT);

	public scroll: WritableSignal<WindowScrollPosition> = signal({ x: 0, y: 0 });
	public scrollX: Signal<number> = computed(() => {
		return this.scroll().x;
	});
	public scrollY: Signal<number> = computed(() => {
		return this.scroll().y;
	});

	constructor() {
		fromEvent(window, 'scroll')
			.pipe(
				map(() => ({ x: 0, y: window.scrollY || this._document.documentElement.scrollTop })),
				share()
			)
			.subscribe((position: WindowScrollPosition) => {
				this.scroll.set(position);
			});
	}
}
