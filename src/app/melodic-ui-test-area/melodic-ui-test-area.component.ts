import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMDDropDownOption, IMDMenuOption, MDDialogService, NotificationService } from '@melodic-ui';
import { TestDialogOneComponent } from '../shared/components/dialogs/test-dialog-one/test-dialog-one/test-dialog-one.component';
import { CustomDropDownOptionComponent } from '../shared/components/custom-dropdown-option/custom-dropdown-option.component';
import { CustomPopupComponent } from '../shared/components/custom-popup/custom-popup.component';
import { CustomToolTipComponent } from '../shared/components/custom-tool-tip/custom-tool-tip.component';

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
	private _notificationService: NotificationService = inject(NotificationService);

	public progressBarValueSuccess: number = 90;
	public progressBarValueWarning: number = 75;
	public progressBarValueError: number = 55;
	public selectedDates: WritableSignal<Date[]> = signal<Date[]>([]);
	public initDates: Date[] = [new Date('2024-09-07 00:00:00')]; // NOTE: Zero out times to avoid timezone issues
	public selectOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
	public selectedOptions: string[] = ['Option 3', 'Option 4', 'Option 5'];
	public isPopupClickawayDisabled: WritableSignal<boolean> = signal<boolean>(false);

	public customDropDownOptionComponent: Type<Component> = CustomDropDownOptionComponent as Type<Component>;

	public dropDownOptions1: IMDDropDownOption[] = [
		{
			value: 1,
			label: 'Option 1',
			icon: 'home'
		},
		{
			value: 2,
			label: 'Option 2',
			icon: 'favorite'
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

	public dropDownOptions1Value: WritableSignal<number | null> = signal<number | null>(null);

	public testUpdateDropDownOptions1Value(): void {
		const randomNum = Math.floor(Math.random() * 5) + 1;
		this.dropDownOptions1Value.set(randomNum);
	}

	public dropDownOptions2: IMDDropDownOption[] = [
		{
			value: 'Option 1',
			label: 'Option 1',
			icon: 'home'
		},
		{
			value: 'Option 2',
			label: 'Option 2',
			icon: 'favorite'
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
			value: 1,
			label: 'Option 1'
		},
		{
			value: 2,
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

	public menuOptions: IMDMenuOption[] = [
		{
			label: 'Menu Item 1',
			icon: 'home',
			click: (item: unknown) => {
				console.log('Menu item 1 clicked', item);
			}
		},
		{
			label: 'Menu Item 2',
			icon: 'favorite',
			click: (item: unknown) => {
				console.log('Menu item 2 clicked', item);
			}
		},
		{
			label: 'Menu Item 3',
			click: (item: unknown) => {
				console.log('Menu item 3 clicked', item);
			}
		},
		{
			label: 'Menu Item 4',
			link: 'https://www.google.com',
			linkTarget: '_blank'
		},
		{
			label: 'Menu Item 5',
			link: 'https://www.tiktok.com'
		}
	];

	public dropdownFormGroup: FormGroup = new FormGroup({
		dropdownInput1: new FormControl(null, Validators.required),
		dropdownInput2: new FormControl('Option 3')
	});

	public dateInputFormControl: FormControl = new FormControl('1979-03-27', [Validators.required]);

	public customToolTipComponent: Type<Component> = CustomToolTipComponent as Type<Component>;

	ngOnInit(): void {
		this.buttonGroupForm.get('buttonGroupInput')?.valueChanges.subscribe((value) => {
			console.log('Button group input changed:', value);
		});

		this.dropdownFormGroup.get('dropdownInput2')?.valueChanges.subscribe((value) => {
			console.log('Drop down input 2 changed:', value);
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

	captureDate(dates: Date[]): void {
		this.selectedDates.set(dates);
	}

	captureDateFromDirective(value: unknown, type: string): void {
		console.log(`${type}: Date from directive: ${value}`);
	}

	openDialog(): void {
		const dialogRef = this._dialogService.open(TestDialogOneComponent as Type<Component>, { seconds: 10, testString: 'Rick Hopkins' });

		dialogRef.afterOpened.subscribe(() => {
			console.log('Dialog opened');
		});

		dialogRef.afterClosed.subscribe((someData) => {
			console.log('Dialog closed', someData);
		});
	}

	buttonToggleChange(value: unknown): void {
		console.log('Button toggle changed:', value);
	}

	dropDownChange(value: unknown): void {
		console.log('Drop down changed:', value);
	}

	openNotification(): void {
		this._notificationService.addNotification({
			type: 'success',
			message: 'This is a test notification',
			duration: 5000
		});

		this._notificationService.addNotification({
			type: 'info',
			message: 'This is a test notification',
			duration: 5000
		});

		this._notificationService.addNotification({
			type: 'warning',
			message: 'This is a test notification',
			duration: 5000
		});

		this._notificationService.addNotification({
			type: 'error',
			message: 'This is a test notification',
			duration: 5000
		});
	}
}
