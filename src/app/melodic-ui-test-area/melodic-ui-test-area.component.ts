import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, MD_COMPONENTS, MD_DIRECTIVES],
	templateUrl: './melodic-ui-test-area.component.html',
	styleUrl: './melodic-ui-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicUiTestAreaComponent {
	public progressBarValue: number = 75;
	public selectedDates: WritableSignal<Date[]> = signal<Date[]>([]);
	public initDates: Date[] = [new Date('2024-09-07 00:00:00')]; // NOTE: Zero out times to avoid timezone issues

	captureDate(dates: Date[]): void {
		this.selectedDates.set(dates);
	}
}
