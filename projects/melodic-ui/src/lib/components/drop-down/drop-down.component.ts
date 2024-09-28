import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input, InputSignal, output, OutputEmitterRef, signal, Type, WritableSignal } from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';

export interface IMDDropDownOption {
	value: string;
	label: string;
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
	public isMultiple: InputSignal<boolean> = input(false);
	public placeholder: InputSignal<string> = input('');

	public input: OutputEmitterRef<unknown> = output<unknown>();
	public change: OutputEmitterRef<unknown> = output<unknown>();
	public focus: OutputEmitterRef<void> = output<void>();
	public blur: OutputEmitterRef<void> = output<void>();

	public isActive: WritableSignal<boolean> = signal(false);

	@HostListener('click', ['$event'])
	onClick(_: MouseEvent) {
		this.isActive.set(true);
	}

	ngOnInit(): void {
		document.addEventListener('click', (event: MouseEvent) => {
			if (!this._elementRef.nativeElement.contains(event.target as Node)) {
				this.isActive.set(false);
			}
		});
	}

	public onChange(value: unknown): void {
		this.change.emit(value);
	}
}
