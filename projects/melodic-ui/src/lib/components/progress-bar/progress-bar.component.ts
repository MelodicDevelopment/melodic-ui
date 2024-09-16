import { Component, HostBinding, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'md-progress-bar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss'
})
export class MDProgressBarComponent {
	public progress: InputSignal<number> = input(0);
	public height: InputSignal<number> = input(0);
	public disabled: InputSignal<boolean> = input(false);

	@HostBinding('style.height')
	private get _height() {
		if (this.height() === 0) {
			return;
		}

		return `${this.height()}px`;
	}

	@HostBinding('class.disabled')
	private get _disabled() {
		return this.disabled();
	}
}
