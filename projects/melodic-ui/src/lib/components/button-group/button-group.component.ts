import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-button-group',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './button-group.component.scss'
})
export class MDButtonGroupComponent {}
