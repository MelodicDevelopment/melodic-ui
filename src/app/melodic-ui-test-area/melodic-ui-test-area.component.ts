import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMDDropDownOption, MDDialogService } from '@melodic-ui';
import { TestDialogOneComponent } from '../shared/components/dialogs/test-dialog-one/test-dialog-one/test-dialog-one.component';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MD_COMPONENTS, MD_DIRECTIVES],
	templateUrl: './melodic-ui-test-area.component.html',
	styleUrl: './melodic-ui-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicUiTestAreaComponent implements OnInit {
	private _dialogService: MDDialogService = inject(MDDialogService);

	public progressBarValue: number = 75;
	public selectedDates: WritableSignal<Date[]> = signal<Date[]>([]);
	public initDates: Date[] = [new Date('2024-09-07 00:00:00')]; // NOTE: Zero out times to avoid timezone issues
	public selectOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
	public selectedOptions: string[] = ['Option 3', 'Option 4', 'Option 5'];

	public dropDownOptions: IMDDropDownOption[] = [
		{
			value: 'Option 1',
			label: 'Option 1'
		},
		{
			value: 'Option 2',
			label: 'Option 2'
		},
		{
			value: 'Option 3',
			label: 'Option 3'
		},
		{
			value: 'Option 4',
			label: 'Option 4'
		},
		{
			value: 'Option 5',
			label: 'Option 5'
		}
	];

	public form: FormGroup = new FormGroup({
		buttonGroupInput: new FormControl('')
	});

	ngOnInit(): void {
		this.form.get('buttonGroupInput')?.valueChanges.subscribe((value) => {
			console.log('Button group input changed:', value);
		});
	}

	toggleButtonGroupDisabled(): void {
		if (this.form.get('buttonGroupInput')?.disabled) {
			this.form.get('buttonGroupInput')?.enable();
		} else {
			this.form.get('buttonGroupInput')?.disable();
		}
	}

	captureDate(dates: Date[]): void {
		this.selectedDates.set(dates);
	}

	openDialog(): void {
		const dialogRef = this._dialogService.open(TestDialogOneComponent as Type<Component>);
	}

	buttonToggleChange(value: unknown): void {
		console.log('Button toggle changed:', value);
	}
}
