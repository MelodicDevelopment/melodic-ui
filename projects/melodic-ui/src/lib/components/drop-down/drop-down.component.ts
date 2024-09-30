import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	effect,
	ElementRef,
	HostListener,
	inject,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	Signal,
	signal,
	Type,
	WritableSignal
} from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';

export interface IMDDropDownOption {
	value: string;
	label: string;
	selected?: boolean;
	component?: Type<Component>;
}

@Component({
	selector: 'md-drop-down',
	standalone: true,
	imports: [CommonModule, MDContentBoxComponent, MDIconComponent],
	templateUrl: './drop-down.component.html',
	styleUrl: './drop-down.component.scss'
})
export class MDDropDownComponent {
	private _elementRef: ElementRef = inject(ElementRef);

	public options: InputSignal<IMDDropDownOption[]> = input.required();
	public multiple: InputSignal<boolean> = input(false);
	public placeholder: InputSignal<string> = input('');

	public input: OutputEmitterRef<unknown> = output<unknown>();
	public change: OutputEmitterRef<unknown> = output<unknown>();
	public focus: OutputEmitterRef<void> = output<void>();
	public blur: OutputEmitterRef<void> = output<void>();

	public isActive: WritableSignal<boolean> = signal(false);

	public internalOptions: WritableSignal<IMDDropDownOption[]> = signal([]);
	public selectedOptions: Signal<IMDDropDownOption[]> = computed(() => {
		return this.internalOptions().filter((o) => o.selected);
	});

	ngOnInit(): void {
		(this._elementRef.nativeElement as HTMLElement).querySelector('input')?.addEventListener('focus', () => {
			this.isActive.set(true);
		});

		document.addEventListener('click', (event: MouseEvent) => {
			if (!this._elementRef.nativeElement.contains(event.target as Node)) {
				this.isActive.set(false);
			}
		});

		this.internalOptions.set(this.options());
	}

	public onChange(value: unknown): void {
		this.change.emit(value);
	}

	public optionSelected(option: IMDDropDownOption): void {
		if (!this.multiple()) {
			this.internalOptions().forEach((o) => (o.selected = false));
			this.isActive.set(false);
		}

		option.selected = !option.selected;

		this.internalOptions.set([...this.internalOptions()]);

		this.change.emit(
			this.internalOptions()
				.filter((o) => o.selected)
				.map((o) => o.value)
		);
	}
}
