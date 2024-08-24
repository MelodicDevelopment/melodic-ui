import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-progress-bar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
	public progress: InputSignal<number> = input(0);
}
