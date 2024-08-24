import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-content-box',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './content-box.component.scss'
})
export class MDContentBoxComponent {}
