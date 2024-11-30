import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
	selector: 'app-custom-tool-tip',
	standalone: true,
	imports: [CommonModule],
	template: '<div>Custom tooltip component <hr>{{ testString() }}</div>'
})
export class CustomToolTipComponent {
	public testString: InputSignal<string> = input<string>('Test String');
}
