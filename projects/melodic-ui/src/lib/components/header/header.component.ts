import { Component, input, InputSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DisplayHeaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type DisplayHeaderVariant = 'regular' | 'medium' | 'medium-italic' | 'semibold' | 'bold';

@Component({
	selector: 'md-header',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './header.component.scss',
	host: {
		'[class]': 'className'
	}
})
export class MDHeaderComponent implements OnInit {
	public size: InputSignal<DisplayHeaderSize> = input<DisplayHeaderSize>('md');
	public variant: InputSignal<DisplayHeaderVariant> = input<DisplayHeaderVariant>('regular');

	public className: string = ``;

	ngOnInit(): void {
		this.className = `md-display-${this.size()}-${this.variant()}`;
	}
}
