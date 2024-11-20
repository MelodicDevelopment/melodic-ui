import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-custom-tool-tip',
	standalone: true,
	imports: [CommonModule],
	template: '<div>Custom tooltip component <hr>More Text</div>'
})
export class CustomToolTipComponent {}
