import { Component, HostBinding, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'md-tooltip',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tooltip.component.html',
	styleUrl: './tooltip.component.scss',
	animations: [
		trigger('fade', [
			transition(':enter', [style({ opacity: 0 }), animate('100ms ease-in', style({ opacity: 1 }))]),
			transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))])
		])
	]
})
export class MDToolTipComponent {
	@HostBinding('@fade') fadeAnimation = true;

	public tooltipText: InputSignal<string> = input.required<string>();
	public tooltipTitle: InputSignal<string | undefined> = input<string | undefined>();
}
