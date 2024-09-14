import { Component, ElementRef, inject, Input, OnInit, output, OutputEmitterRef } from '@angular/core';
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

	@Input({ required: true }) public value: unknown = null;
	@Input() public disabled: boolean = false;

	public checked: boolean = false;

	public change: OutputEmitterRef<unknown> = output<unknown>();

	ngOnInit(): void {
		if ((this._elementRef.nativeElement as HTMLElement).parentElement?.tagName !== 'MD-BUTTON-GROUP') {
			throw new Error('Button toggle must be used in an md-button-group element.');
		}
	}

	public onClick() {
		this.checked = !this.checked;
		this.change.emit(this.checked ? this.value : null);
	}
}
