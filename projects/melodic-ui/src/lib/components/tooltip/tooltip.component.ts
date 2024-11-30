import { Component, HostBinding, input, InputSignal, OnInit, Type } from '@angular/core';
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
export class MDToolTipComponent implements OnInit {
	@HostBinding('@fade') fadeAnimation = true;

	public tooltipText: InputSignal<string | undefined> = input<string>();
	public tooltipComponent: InputSignal<Type<Component> | undefined> = input<Type<Component>>();
	public tooltipComponentInputs: InputSignal<Record<string, unknown>> = input<Record<string, unknown>>({});
	public tooltipTitle: InputSignal<string | undefined> = input<string | undefined>();

	ngOnInit(): void {
		if (this.tooltipText()?.length === 0 && this.tooltipComponent() === undefined) {
			throw new Error('Must provide either a tooltip text or a tooltip component');
		}
	}
}
