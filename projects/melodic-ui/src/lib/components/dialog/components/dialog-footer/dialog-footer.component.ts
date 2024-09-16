import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-dialog-footer',
	standalone: true,
	imports: [CommonModule],
	template: '<ng-content></ng-content>',
	styleUrl: './dialog-footer.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDDialogFooterComponent {}
