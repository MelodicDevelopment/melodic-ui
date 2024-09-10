import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-dialog',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog.component.scss'
})
export class MDDialogComponent {}
