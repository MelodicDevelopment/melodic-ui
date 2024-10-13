import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-tooltip',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tooltip.component.html',
	styleUrl: './tooltip.component.scss'
})
export class MDToolTipComponent {
	public tooltipText: InputSignal<string> = input.required<string>();
	public tooltipTitle: InputSignal<string | undefined> = input<string | undefined>();
}
