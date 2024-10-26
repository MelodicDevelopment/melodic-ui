import { Component, HostBinding, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Range = {
	error?: { start: number; end: number };
	warning?: { start: number; end: number };
	success?: { start: number; end: number };
};

@Component({
	selector: 'md-progress-bar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss'
})
export class MDProgressBarComponent {
	public ranges: InputSignal<Range | undefined> = input<Range>();
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

	@HostBinding('class.success')
	private get _success() {
		const successRange = this.ranges()?.success;

		if (!successRange) {
			return false;
		}

		return this.progress() >= successRange.start && this.progress() <= successRange.end;
	}

	@HostBinding('class.warning')
	private get _warning() {
		const warningRange = this.ranges()?.warning;

		if (!warningRange) {
			return false;
		}

		return this.progress() >= warningRange.start && this.progress() <= warningRange.end;
	}

	@HostBinding('class.error')
	private get _error() {
		const errorRange = this.ranges()?.error;

		if (!errorRange) {
			return false;
		}

		return this.progress() >= errorRange.start && this.progress() <= errorRange.end;
	}

	@HostBinding('class.disabled')
	private get _disabled() {
		return this.disabled();
	}
}
