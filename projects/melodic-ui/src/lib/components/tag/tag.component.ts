import { Component, HostBinding, input, InputSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TagType = 'default' | 'primary' | 'secondary' | 'warning';

@Component({
	selector: 'md-tag',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag.component.html',
	styleUrl: './tag.component.scss'
})
export class MDTagComponent implements OnInit {
	@HostBinding('class.default') private _isDefault: boolean = false;
	@HostBinding('class.primary') private _isPrimary: boolean = false;
	@HostBinding('class.secondary') private _isSecondary: boolean = true;
	@HostBinding('class.warning') private _isWarning: boolean = false;

	public type: InputSignal<TagType> = input<TagType>('default');

	ngOnInit(): void {
		this._isDefault = this.type() === 'default';
		this._isPrimary = this.type() === 'primary';
		this._isSecondary = this.type() === 'secondary';
		this._isWarning = this.type() === 'warning';
	}
}
