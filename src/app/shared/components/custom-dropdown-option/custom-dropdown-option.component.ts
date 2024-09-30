import { CommonModule } from '@angular/common';
import { Component, Input, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { IMDDropDownOption } from '@melodic-ui';

@Component({
	selector: 'app-custom-dropdown-option',
	standalone: true,
	imports: [CommonModule],
	template: '<div>Custom: {{ option!.label }}</div>'
})
export class CustomDropDownOptionComponent {
	@Input({ required: true }) public option!: IMDDropDownOption;
}
