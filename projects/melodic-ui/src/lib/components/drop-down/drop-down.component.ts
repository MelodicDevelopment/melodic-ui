import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	computed,
	ElementRef,
	forwardRef,
	inject,
	input,
	InputSignal,
	OnInit,
	output,
	OutputEmitterRef,
	Signal,
	signal,
	Type,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { MDPopupComponent } from '../popup/popup.component';

export interface IMDDropDownOption {
	value: string | number;
	label: string;
	icon?: string;
	selected?: boolean;
}

@Component({
	selector: 'md-drop-down',
	standalone: true,
	imports: [CommonModule, MDIconComponent, MDPopupComponent],
	templateUrl: './drop-down.component.html',
	styleUrl: './drop-down.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MDDropDownComponent),
			multi: true
		}
	],
	encapsulation: ViewEncapsulation.None
})
export class MDDropDownComponent implements ControlValueAccessor, OnInit, AfterViewInit {
	private _elementRef: ElementRef = inject(ElementRef);

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	private _value: unknown;
	private _searchString: WritableSignal<string> = signal('');

	private _inputElement: HTMLElement | undefined = undefined;
	private _inputPlaceholderElement: HTMLElement | undefined = undefined;
	private _dropdownWrapperElement: HTMLElement | undefined = undefined;

	public value: InputSignal<unknown> = input();
	public options: InputSignal<IMDDropDownOption[]> = input.required();
	public typeAhead: InputSignal<boolean> = input(false);
	public maxTypeAheadLength: InputSignal<number> = input(24);
	public multiple: InputSignal<boolean> = input(false);
	public placeholder: InputSignal<string> = input('');
	public disabled: InputSignal<boolean> = input(false);
	public optionComponent: InputSignal<Type<Component> | undefined> = input();

	public input: OutputEmitterRef<unknown> = output<unknown>();
	public change: OutputEmitterRef<unknown> = output<unknown>();
	public focus: OutputEmitterRef<void> = output<void>();
	public blur: OutputEmitterRef<void> = output<void>();

	public isActive: WritableSignal<boolean> = signal(false);

	public internalOptions: WritableSignal<IMDDropDownOption[]> = signal([]);
	public selectedOptions: Signal<IMDDropDownOption[]> = computed(() => {
		return this.internalOptions().filter((o) => o.selected);
	});

	public filteredOptions: Signal<IMDDropDownOption[]> = computed(() => {
		const searchString: string = this._searchString();
		if (!searchString) {
			return this.internalOptions();
		}

		return this.internalOptions().filter((o) => o.label.toLowerCase().trim().includes(searchString.toLowerCase().trim()));
	});

	constructor() {
		toObservable(this.options)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((options) => {
				this.internalOptions.set(options);
			});

		toObservable(this.value)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((value) => {
				this.writeValue(value);
			});
	}

	ngOnInit(): void {
		this.internalOptions.set(this.options());
		this.writeValue(this.value());
	}

	ngAfterViewInit(): void {
		this._inputElement = (this._elementRef.nativeElement as HTMLElement).querySelector('div.text-field') as HTMLElement;
		this._inputPlaceholderElement = (this._elementRef.nativeElement as HTMLElement).querySelector('div.placeholder') as HTMLElement;
		this._dropdownWrapperElement = (this._elementRef.nativeElement as HTMLElement).querySelector('div.dropdown-input-wrapper') as HTMLElement;

		this._dropdownWrapperElement?.addEventListener('click', () => {
			if (!this.disabled() && !this.isActive()) {
				this._inputPlaceholderElement?.setAttribute('hidden', 'true');
				this._inputElement?.focus();
			}
		});

		document.addEventListener('click', (event: MouseEvent) => {
			if (this.isActive()) {
				if (!this._elementRef.nativeElement.contains(event.target as Node)) {
					this.onTouched();
				}
			}
		});
	}

	public optionSelected(option: IMDDropDownOption, event?: MouseEvent): void {
		if (event) {
			event.stopPropagation();
		}

		if (!this.multiple()) {
			this.internalOptions().forEach((o) => (o.selected = false));
		}

		option.selected = !option.selected;

		this.internalOptions.set([...this.internalOptions()]);

		if (!this.multiple()) {
			this.writeValue(option.value);
			return;
		}

		this.writeValue(
			this.internalOptions()
				.filter((o) => o.selected)
				.map((o) => o.value)
		);
	}

	public writeValue(value: unknown): void {
		this.onChange(value);
		this.onTouched();

		this.change.emit(value);

		this._value = value;

		this.setSelectedOptions(value);
	}

	public setSelectedOptions(value: unknown): void {
		if (value) {
			if (Array.isArray(value)) {
				this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: (value as Array<string | number>).includes(o.value) }))]);
				return;
			}

			this.internalOptions.set([...this.internalOptions().map((o) => ({ ...o, selected: value === o.value }))]);

			this.resetInput();
		}
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	public onInput(event: Event, popup: MDPopupComponent): void {
		const value: string = (event.target as HTMLElement).innerText;

		if (value.includes('\n') || value.includes('\r') || value.includes('U+A0')) {
			(event.target as HTMLElement).innerText = value.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/U+A0/g, ' ');
			this.moveCursorToEnd();
			return;
		}

		if (value.length > this.maxTypeAheadLength()) {
			(event.target as HTMLElement).innerText = value.substring(0, this.maxTypeAheadLength());
			this.moveCursorToEnd();
			return;
		}

		this._searchString.set(value);

		this.input.emit(event);

		popup.show();
	}

	public onOptionsOpen(popupContent: HTMLElement): void {
		const selectedOptions: HTMLElement[] = Array.from(popupContent.querySelectorAll('div.option.selected'));
		if (selectedOptions.length > 0) {
			const selectedOption: HTMLElement = selectedOptions[0];
			selectedOption.scrollIntoView({ block: 'nearest' });
		}

		this.isActive.set(true);
	}

	public onOptionsClose(): void {
		this.isActive.set(false);
		this.resetInput();
	}

	private resetInput(): void {
		this._searchString.set('');

		if (this._inputElement) {
			this._inputElement.innerText = '';
			this._inputElement.focus();
		}
	}

	private moveCursorToEnd(): void {
		const range = document.createRange();
		const sel = window.getSelection();

		range.selectNodeContents(this._inputElement as Node);
		range.collapse(false);

		if (sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}
}
