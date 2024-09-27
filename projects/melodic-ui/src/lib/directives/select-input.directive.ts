import { AfterViewInit, Directive, ElementRef, inject, ViewContainerRef } from '@angular/core';
import { MDContentBoxComponent } from '../components/content-box/content-box.component';

@Directive({
	standalone: true,
	selector: '[md-select-input]'
})
export class MDSelectInputDirective implements AfterViewInit {
	private _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
	private _elementRef: ElementRef = inject(ElementRef);
	private _selectContainer: HTMLDivElement = document.createElement('div');
	private _selectOptionsListComponent: HTMLElement = document.createElement('div');
	private _selectEl: HTMLSelectElement = this._elementRef.nativeElement as HTMLSelectElement;
	private _selectOptionsEls: HTMLOptionElement[] = [];

	constructor() {
		if (this._selectEl.tagName !== 'SELECT') {
			console.error('The md-select-input directive must be applied to a select element');
			return;
		}

		this._selectContainer.classList.add('md-select-container');
		this._selectEl.after(this._selectContainer);
		this._selectContainer.appendChild(this._selectEl);

		this._selectEl.addEventListener('click', (event) => {
			console.log('clicked');

			event.stopPropagation();
			event.preventDefault();
		});
	}

	ngAfterViewInit() {
		this._viewContainerRef.clear();
		const componentRef = this._viewContainerRef.createComponent<MDContentBoxComponent>(MDContentBoxComponent);

		this._selectOptionsListComponent = componentRef.location.nativeElement as HTMLElement;
		this._selectContainer.appendChild(this._selectOptionsListComponent);

		this._selectOptionsEls = Array.from(this._selectEl.options);
		this.buildSelectOptionsList();

		this._selectEl.addEventListener('focus', () => {
			this._selectOptionsListComponent.classList.add('open');
		});

		document.addEventListener('click', (event: MouseEvent) => {
			if (!this._selectContainer.contains(event.target as Node)) {
				this._selectOptionsListComponent.classList.remove('open');
			}
		});
	}

	private buildSelectOptionsList(): void {
		setTimeout(() => {
			// NOTE: Seems to need just a little time to select options
			const selectOptions: HTMLElement[] = [];
			const selectedOptions = Array.from(this._selectEl.selectedOptions);

			this._selectOptionsEls.forEach((optionEl: HTMLOptionElement) => {
				const option = document.createElement('div');
				option.classList.add('md-select-option');
				option.setAttribute('value', optionEl.value);
				option.innerHTML = optionEl.textContent || '';
				this._selectOptionsListComponent.appendChild(option);
				selectOptions.push(option);

				if (selectedOptions.includes(optionEl)) {
					option.classList.add('selected');
				}

				option.addEventListener('click', () => {
					if (!this._selectEl.hasAttribute('multiple')) {
						selectOptions.forEach((opt: HTMLElement) => {
							opt.classList.remove('selected');
						});
					}

					optionEl.selected = !optionEl.selected;

					if (optionEl.selected) {
						option.classList.add('selected');
					} else {
						option.classList.remove('selected');
					}

					if (!this._selectEl.hasAttribute('multiple')) {
						this._selectOptionsListComponent.classList.remove('open');
					}
				});
			});
		}, 100);
	}
}
