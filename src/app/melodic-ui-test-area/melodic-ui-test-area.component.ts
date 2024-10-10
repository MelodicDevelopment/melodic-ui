import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMDDropDownOption, MDDialogService } from '@melodic-ui';
import { TestDialogOneComponent } from '../shared/components/dialogs/test-dialog-one/test-dialog-one/test-dialog-one.component';
import { CustomDropDownOptionComponent } from '../shared/components/custom-dropdown-option/custom-dropdown-option.component';
import { CustomPopupComponent } from '../shared/components/custom-popup/custom-popup.component';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MD_COMPONENTS, MD_DIRECTIVES, CustomPopupComponent],
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

	public customDropDownOptionComponent: Type<Component> = CustomDropDownOptionComponent as Type<Component>;

	public dropDownOptions1: IMDDropDownOption[] = [
		{
			value: 1,
			label: 'Option 1'
		},
		{
			value: 2,
			label: 'Option 2'
		},
		{
			value: 3,
			label: 'Option 3'
		},
		{
			value: 4,
			label: 'Option 4'
		},
		{
			value: 5,
			label: 'Option 5'
		}
	];

	public dropDownOptions1Value: WritableSignal<number> = signal<number>(5);

	public testUpdateDropDownOptions1Value(): void {
		const randomNum = Math.floor(Math.random() * 5) + 1;
		this.dropDownOptions1Value.set(randomNum);
	}

	public dropDownOptions2: IMDDropDownOption[] = [
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

	public dropDownOptions3: IMDDropDownOption[] = [
		{
			value: 'Option 1',
			label: 'Option 1'
		},
		{
			value: 'Option 2',
			label: 'Option 2'
		}
	];

	public dropDownOptions4: IMDDropDownOption[] = [
		{
			value: 'Option 3',
			label: 'Option 3'
		},
		{
			value: 'Option 4',
			label: 'Option 4'
		}
	];

	ngOnInit(): void {
		this.buttonGroupForm.get('buttonGroupInput')?.valueChanges.subscribe((value) => {
			console.log('Button group input changed:', value);
		});

		this.dropdownFormGroup.get('dropdownInput1')?.valueChanges.subscribe((value) => {
			console.log('Drop down input changed:', value);
		});
	}

	public buttonGroupForm: FormGroup = new FormGroup({
		buttonGroupInput: new FormControl('')
	});

	toggleButtonGroupDisabled(): void {
		if (this.buttonGroupForm.get('buttonGroupInput')?.disabled) {
			this.buttonGroupForm.get('buttonGroupInput')?.enable();
		} else {
			this.buttonGroupForm.get('buttonGroupInput')?.disable();
		}
	}

	public dropdownFormGroup: FormGroup = new FormGroup({
		dropdownInput1: new FormControl('', Validators.required),
		dropdownInput2: new FormControl('')
	});

	captureDate(dates: Date[]): void {
		this.selectedDates.set(dates);
	}

	captureDateFromDirective(value: unknown, type: string): void {
		console.log(`${type}: Date from directive: ${value}`);
	}

	openDialog(): void {
		const dialogRef = this._dialogService.open(TestDialogOneComponent as Type<Component>);
	}

	buttonToggleChange(value: unknown): void {
		console.log('Button toggle changed:', value);
	}

	dropDownChange(value: unknown): void {
		console.log('Drop down changed:', value);
	}
}
