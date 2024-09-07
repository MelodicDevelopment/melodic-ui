import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, MD_COMPONENTS],
	templateUrl: './melodic-ui-test-area.component.html',
	styleUrl: './melodic-ui-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicUiTestAreaComponent {
	public progressBarValue: number = 75;
	public selectedDate: WritableSignal<Date[]> = signal<Date[]>([]);

	captureDate(date: Date | Date[] | null): void {
		this.selectedDate.set([...(date as Date[])]);
	}
}
