import { Component, ElementRef, inject, input, Input, InputSignal, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-button-toggle',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button-toggle.component.html',
	styleUrl: './button-toggle.component.scss'
})
export class MDButtonToggleComponent implements OnInit {
	private _elementRef: ElementRef = inject(ElementRef);

	public value: InputSignal<unknown> = input.required();
	@Input() public disabled: boolean = false;

	public checked: WritableSignal<boolean> = signal<boolean>(false);

	public change: OutputEmitterRef<unknown> = output<unknown>();

	ngOnInit(): void {
		if ((this._elementRef.nativeElement as HTMLElement).parentElement?.tagName !== 'MD-BUTTON-GROUP') {
			throw new Error('Button toggle must be used in an md-button-group element.');
		}
	}

	public onClick() {
		this.checked.set(!this.checked());
		this.change.emit(this.checked() ? this.value() : null);
	}
}
