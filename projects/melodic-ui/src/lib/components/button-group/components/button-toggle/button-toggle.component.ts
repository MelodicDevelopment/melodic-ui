import { booleanAttribute, Component, Input, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-button-toggle',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button-toggle.component.html',
	styleUrl: './button-toggle.component.scss'
})
export class MDButtonToggleComponent {
	@Input({ required: true }) public value: unknown = null;
	@Input() public checked: boolean = false;
	@Input() public disabled: boolean = false;

	public change: OutputEmitterRef<unknown> = output<unknown>();

	public onClick() {
		this.change.emit(this.checked ? null : this.value);
	}
}
