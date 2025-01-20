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
	ViewChild,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { MDIconComponent } from '../icon/icon.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, skip } from 'rxjs';
import { MDPopupComponent } from '../popup/popup.component';
import { KeyboardService } from '../../services/keyboard.service';
import { IKeyboardEvent } from '../../services/interfaces/ikeyboard-event.interface';
import { IconRef } from '../../types';

export interface IMDDropDownOption {
	value: string | number;
	label: string;
	icon?: IconRef;
	selected?: boolean;
}

interface IMDDropDownOptionInternal extends IMDDropDownOption {
	active?: boolean;
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
	@ViewChild(MDPopupComponent) private _popupRef!: MDPopupComponent;
	@ViewChild('popupContent') private _popupContentRef!: ElementRef;

	private _elementRef: ElementRef = inject(ElementRef);
	private _keyboardService: KeyboardService = inject(KeyboardService);

	private onChange: (value: unknown) => void = () => {};
	private onTouched: () => void = () => {};

	private _searchString: WritableSignal<string> = signal('');
	private _activeOptionIndex: WritableSignal<number> = signal(-1);

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

	public internalOptions: WritableSignal<IMDDropDownOptionInternal[]> = signal([]);
	public selectedOptions: Signal<IMDDropDownOption[]> = computed(() => {
		return this.internalOptions().filter((o) => o.selected);
	});

	public filteredOptions: Signal<IMDDropDownOptionInternal[]> = computed(() => {
		const searchString: string = this._searchString();

		const activeIndex: number = this._activeOptionIndex();

		const filteredOptions: IMDDropDownOptionInternal[] = this.internalOptions()
			.filter((o) => !searchString || o.label.toLowerCase().trim().includes(searchString.toLowerCase().trim()))
			.map((option, index) => {
				return { ...option, active: index === activeIndex };
			});

		return filteredOptions;
	});

	constructor() {
		toObservable(this.options)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((options) => {
				this.internalOptions.set(options.map((o) => ({ ...o, active: false })));
			});

		toObservable(this.value)
			.pipe(skip(1), takeUntilDestroyed())
			.subscribe((value) => {
				this.writeValue(value);
			});

		toObservable(this._keyboardService.keydown)
			.pipe(
				filter((event) => event !== null),
				takeUntilDestroyed()
			)
			.subscribe((event) => {
				this.navigateOptions(event);
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
			this.writeValue(option.value);
			return;
		}

		const selectedOptions = this.internalOptions().filter((o) => o.selected);
		const matchingOption = selectedOptions.findIndex((o) => o.value === option.value);

		if (matchingOption > -1) {
			selectedOptions.splice(matchingOption, 1);
		}

		if (matchingOption === -1) {
			selectedOptions.push(option);
		}

		this.writeValue([...selectedOptions.map((o) => o.value)]);
	}

	public writeValue(value: unknown): void {
		this.onChange(value);
		this.onTouched();

		this.change.emit(value);

		this.setSelectedOptions(value);
	}

	public setSelectedOptions(value: unknown): void {
		if (!this.multiple() && this._popupRef) {
			this._popupRef.hide();
		}

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

	public onInput(event: Event): void {
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

		this._popupRef.show();
	}

	public scrollToActiveOrSelected(state: 'selected' | 'active' = 'selected'): void {
		setTimeout(() => {
			const selectedOptions: HTMLElement[] = Array.from(this._popupContentRef.nativeElement.querySelectorAll(`div.option.${state}`));
			if (selectedOptions.length > 0) {
				const selectedOption: HTMLElement = selectedOptions[0];
				selectedOption.scrollIntoView({ block: 'start' });
			}

			this.isActive.set(true);
		}, 10); //TODO: Not sure why it needs to be in a timeout
	}

	public onOptionsClose(): void {
		this.isActive.set(false);
		this._activeOptionIndex.set(-1);
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

	private navigateOptions(event: IKeyboardEvent): void {
		if (!this.isActive()) {
			return;
		}

		if (event.key === 'Escape') {
			this.onOptionsClose();
			this._popupRef.hide();
			return;
		}

		if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
			event.eventRef.preventDefault();

			if (event.key === 'ArrowDown') {
				this._activeOptionIndex.set((this._activeOptionIndex() + 1) % this.filteredOptions().length);
			} else if (event.key === 'ArrowUp') {
				this._activeOptionIndex.set((this._activeOptionIndex() - 1 + this.filteredOptions().length) % this.filteredOptions().length);
			} else if (event.key === 'Enter') {
				this.optionSelected(this.filteredOptions()[this._activeOptionIndex()]);
			}

			this.scrollToActiveOrSelected('active');
		}
	}
}
