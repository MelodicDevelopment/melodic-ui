import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IKeyboardEvent } from './interfaces/ikeyboard-event.interface';
import { IEventTarget } from './interfaces/ievent-target.interface';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
	constructor() {
		document.body.addEventListener('keyup', this.emit.bind(this));
		document.body.addEventListener('keydown', this.emit.bind(this));
		document.body.addEventListener('keypress', this.emit.bind(this));
	}

	public keyboardEvent: WritableSignal<IKeyboardEvent | null> = signal<IKeyboardEvent | null>(null);
	public keyup: Signal<IKeyboardEvent | null> = computed(() => {
		return this.keyboardEvent() && this.keyboardEvent()?.eventType === 'keyup' ? this.keyboardEvent() : null;
	});
	public keydown: Signal<IKeyboardEvent | null> = computed(() => {
		return this.keyboardEvent() && this.keyboardEvent()?.eventType === 'keydown' ? this.keyboardEvent() : null;
	});
	public keypress: Signal<IKeyboardEvent | null> = computed(() => {
		return this.keyboardEvent() && this.keyboardEvent()?.eventType === 'keypress' ? this.keyboardEvent() : null;
	});

	private emit(event: KeyboardEvent): void {
		const eventTarget: IEventTarget = {
			tagName: (<HTMLElement>event.target).tagName.toLowerCase(),
			classList: Array.from((<HTMLElement>event.target).classList)
		};

		const eventTargetPath: IEventTarget[] = event
			.composedPath()
			.filter((p) => {
				return (<HTMLElement>p).tagName !== undefined;
			})
			.map((p) => {
				return {
					tagName: (<HTMLElement>p).tagName.toLowerCase(),
					classList: Array.from((<HTMLElement>p).classList)
				};
			});

		/** emit the keyboard event */
		const keyboardEvent: IKeyboardEvent = {
			key: event.key,
			code: event.code,
			altKey: event.altKey,
			ctrlKey: event.ctrlKey,
			metaKey: event.metaKey,
			shiftKey: event.shiftKey,
			eventType: event.type,
			target: eventTarget,
			path: eventTargetPath,
			eventRef: event
		};
		this.keyboardEvent.set(keyboardEvent);
	}
}
