import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMDDropDownOption, IMDMenuOption, MDDialogService, MDAlertService, Day, RouterService } from '@melodic-ui';
import { TestDialogOneComponent } from '../shared/components/dialogs/test-dialog-one/test-dialog-one/test-dialog-one.component';
import { CustomDropDownOptionComponent } from '../shared/components/custom-dropdown-option/custom-dropdown-option.component';
import { CustomPopupComponent } from '../shared/components/custom-popup/custom-popup.component';
import { CustomToolTipComponent } from '../shared/components/custom-tool-tip/custom-tool-tip.component';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-melodic-ui-test-area',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MD_COMPONENTS, MD_DIRECTIVES, CustomPopupComponent],
	templateUrl: './melodic-ui-test-area.component.html',
	styleUrl: './melodic-ui-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicUiTestAreaComponent implements OnInit, AfterViewInit {
	private _dialogService: MDDialogService = inject(MDDialogService);
	private _alertService: MDAlertService = inject(MDAlertService);
	private _routerService: RouterService = inject(RouterService);

	public elementRef: ElementRef = inject(ElementRef);

	constructor() {
		effect(() => {
			console.log('Route Data:', this._routerService.routeData());
			console.log('Query Params:', this._routerService.queryParams());
			console.log('Route Params:', this._routerService.routeParams());
			console.log('Route Path:', this._routerService.routePath());
		});
	}

	public progressBarValueSuccess: number = 90;
	public progressBarValueWarning: number = 75;
	public progressBarValueError: number = 55;

	public buttonGroupDefaultValue: WritableSignal<string> = signal<string>('2');

	public selectedDates: WritableSignal<Date[]> = signal<Date[]>([new Date(`${new Date().toLocaleDateString()} 00:00:00`)]);
	// public selectedDates2: WritableSignal<Date[]> = signal<Date[]>([new Date(`${new Date().toLocaleDateString()} 00:00:00`)]);
	public selectedDates2: WritableSignal<Date[]> = signal<Date[]>([]);

	public selectOptions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
	public selectedOptions: string[] = ['Option 3', 'Option 4', 'Option 5'];
	public isPopupClickawayDisabled: WritableSignal<boolean> = signal<boolean>(false);

	public customDropDownOptionComponent: Type<Component> = CustomDropDownOptionComponent as Type<Component>;

	public dropDownOptions1: IMDDropDownOption[] = [
		{
			value: null,
			label: 'Select an Option'
		},
		{
			value: 1,
			label: 'Option 1',
			icon: { type: 'material', icon: 'home' }
		},
		{
			value: 2,
			label: 'Option 2',
			icon: { type: 'material', icon: 'favorite' }
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
		},
		{
			value: 6,
			label: 'Option 6',
			icon: { type: 'material', icon: 'home' }
		},
		{
			value: 7,
			label: 'Option 7',
			icon: { type: 'material', icon: 'favorite' }
		},
		{
			value: 8,
			label: 'Option 8'
		},
		{
			value: 9,
			label: 'Option 9'
		},
		{
			value: 10,
			label: 'Option 10'
		},
		{
			value: 11,
			label: 'Option 11',
			icon: { type: 'material', icon: 'home' }
		},
		{
			value: 12,
			label: 'Option 12',
			icon: { type: 'material', icon: 'favorite' }
		},
		{
			value: 13,
			label: 'Option 13'
		},
		{
			value: 14,
			label: 'Option 14'
		},
		{
			value: 15,
			label: 'Option 15'
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
			icon: { type: 'material', icon: 'home' }
		},
		{
			value: 'Option 2',
			label: 'Option 2',
			icon: { type: 'material', icon: 'favorite' }
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

	public dropDownOptions5: IMDDropDownOption[] = [
		{
			value: 'Option 5',
			label: 'Option 5'
		},
		{
			value: 'Option 6',
			label: 'Option 6'
		}
	];

	public menuOptions: IMDMenuOption[] = [
		{
			label: 'Menu Item 1',
			icon: { type: 'material', icon: 'home' },
			click: (item: unknown) => {
				console.log('Menu item 1 clicked', item);
			}
		},
		{
			label: 'Menu Item 2',
			icon: { type: 'material', icon: 'favorite' },
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
			icon: {
				type: 'url',
				icon: 'untitled-ui/general/link-01'
			},
			class: 'test-class',
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
		dropdownInput2: new FormControl('Option 3'),
		dropdownInput3: new FormControl('Option 5')
	});

	public dateInputFormControl: FormControl = new FormControl(new Date().toLocaleDateString(), [Validators.required]);

	public customToolTipComponent: Type<Component> = CustomToolTipComponent as Type<Component>;
	public customToolTipComponentInputs: Record<string, unknown> = { testString: 'Rick Hopkins' };

	ngOnInit(): void {
		this.buttonGroupForm.get('buttonGroupInput')?.valueChanges.subscribe((value) => {
			console.log('Button group input changed:', value);
		});

		this.dropdownFormGroup.get('dropdownInput2')?.valueChanges.subscribe((value) => {
			console.log('Drop down input 2 changed:', value);
		});

		this.dropdownFormGroup.get('dropdownInput3')?.valueChanges.subscribe((value) => {
			console.log('Drop down input 3 changed:', value);
		});
	}

	public buttonGroupDisabled: WritableSignal<boolean> = signal<boolean>(false);

	ngAfterViewInit(): void {
		this.buttonGroupDisabled.set(true);
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

	captureDate2(dates: Date[]): void {
		this.selectedDates2.set(dates);
	}

	randomFutureDate(): Date {
		const now = Date.now();
		const yearEnd = new Date(new Date().getFullYear() + 1, 0, 1).getTime();
		const randomFutureDate = new Date(now + Math.random() * (yearEnd - now));
		randomFutureDate.setHours(0, 0, 0, 0);

		return randomFutureDate;
	}

	setDate(): void {
		const randomFutureDate = this.randomFutureDate();
		this.selectedDates2.set([randomFutureDate]);
	}

	checkDate(day: Day): boolean {
		const now = new Date();
		now.setHours(0, 0, 0, 0);

		// future dates disabled
		return day.date > now;
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

	openAlert(): void {
		this._alertService.addAlert({
			title: 'Just Default',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'default',
			action: {
				text: 'View',
				actionFn: () => {
					window.open('https://www.google.com', '_blank');
				}
			},
			onClose: (action: string) => {
				alert('Closed Me: ' + action);
			}
		});

		this._alertService.addAlert({
			title: 'Just Brand',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'brand',
			duration: 8000
		});

		this._alertService.addAlert({
			title: 'Success Has Occurred!',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'success',
			duration: 4000
		});

		this._alertService.addAlert({
			title: 'Just Informational',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'info',
			duration: 3000
		});

		this._alertService.addAlert({
			title: `You've Been Warned!`,
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'warning',
			duration: 6000
		});

		this._alertService.addAlert({
			title: 'An Error Occurred!',
			message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.',
			type: 'error',
			duration: 7000
		});
	}
}
