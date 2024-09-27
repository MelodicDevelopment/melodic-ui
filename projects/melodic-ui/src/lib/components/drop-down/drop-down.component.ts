import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, Type } from '@angular/core';
import { MDContentBoxComponent } from '../content-box/content-box.component';
import { MDIconComponent } from '../icon/icon.component';

export interface IMDDropDownOption {
	value: string;
	label: string;
	component?: Type<Component>;
}

@Component({
	selector: 'md-drop-down',
	standalone: true,
	imports: [CommonModule, MDContentBoxComponent, MDIconComponent],
	templateUrl: './drop-down.component.html',
	styleUrl: './drop-down.component.scss'
})
export class MDDropDownComponent {
	public options: InputSignal<IMDDropDownOption[]> = input.required();
	public isMultiple: InputSignal<boolean> = input(false);
}
