import { Injectable } from '@angular/core';

interface IScriptTracker {
	key: string;
	element: HTMLElement;
	type: 'js' | 'css';
}

@Injectable({
	providedIn: 'root'
})
export class ScriptLoaderService {
	private _tracker: IScriptTracker[] = [];

	loadJS(scriptUrl: string, key?: string): Promise<HTMLScriptElement> {
		return new Promise((resolve) => {
			const scriptEl: HTMLScriptElement = document.createElement('script');
			scriptEl.type = 'text/javascript';
			scriptEl.async = true;
			scriptEl.src = scriptUrl;
			scriptEl.addEventListener('load', (ev: Event) => {
				this._tracker.push({
					key: key || scriptUrl,
					element: scriptEl,
					type: 'js'
				});
				resolve(scriptEl);
			});

			document.body.appendChild(scriptEl);
		});
	}

	loadCSS(styleUrl: string, key?: string): Promise<HTMLLinkElement> {
		return new Promise((resolve) => {
			const styleEl: HTMLLinkElement = document.createElement('link');
			styleEl.type = 'text/css';
			styleEl.rel = 'stylesheet';
			styleEl.href = styleUrl;
			styleEl.addEventListener('load', (ev: Event) => {
				this._tracker.push({
					key: key || styleUrl,
					element: styleEl,
					type: 'css'
				});
				resolve(styleEl);
			});

			document.head.appendChild(styleEl);
		});
	}

	unload(el: HTMLElement): void {
		if (el.tagName.toLowerCase() === 'script') {
			document.body.removeChild(el);
		}

		if (el.tagName.toLowerCase() === 'link') {
			document.head.removeChild(el);
		}

		el.remove();
	}

	removeElement(key: string, type: string): void {
		const tracker: IScriptTracker | undefined = this._tracker.find((t) => t.key === key && t.type === type);
		if (tracker) {
			this.unload(tracker.element);
			this._tracker.splice(this._tracker.indexOf(tracker), 1);
		}
	}

	getElement(key: string, type: string): IScriptTracker | undefined {
		return this._tracker.find((t) => t.key === key && t.type === type);
	}
}
