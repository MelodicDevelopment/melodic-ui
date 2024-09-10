import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, Type, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@melodic-ui/components/dialog/dialog.service';
import { TestDialogOneComponent } from '../shared/components/dialogs/test-dialog-one/test-dialog-one/test-dialog-one.component';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MD_COMPONENTS, MD_DIRECTIVES],
	templateUrl: './melodic-ui-test-area.component.html',
	styleUrl: './melodic-ui-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicUiTestAreaComponent {
	private _dialogService: DialogService = inject(DialogService);

	public progressBarValue: number = 75;
	public selectedDates: WritableSignal<Date[]> = signal<Date[]>([]);
	public initDates: Date[] = [new Date('2024-09-07 00:00:00')]; // NOTE: Zero out times to avoid timezone issues
	public selectOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
	public selectedOptions: string[] = ['Option 3', 'Option 4', 'Option 5'];

	captureDate(dates: Date[]): void {
		this.selectedDates.set(dates);
	}

	openDialog(): void {
		this._dialogService.open(TestDialogOneComponent as Type<Component>);
	}
}
