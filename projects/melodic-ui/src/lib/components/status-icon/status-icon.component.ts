import { Component, computed, HostBinding, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDIconComponent } from '../icon/icon.component';
import { IndicatorType } from '../../types/indicator-type.type';

@Component({
	selector: 'md-status-icon',
	standalone: true,
	imports: [CommonModule, MDIconComponent],
	template: '<md-icon>{{ iconName() }}</md-icon>',
	styleUrl: './status-icon.component.scss'
})
export class MDStatusIconComponent {
	public status: InputSignal<IndicatorType> = input<IndicatorType>('default');
	public icon: InputSignal<string> = input<string>('');

	public iconName: Signal<string> = computed(() => {
		if (this.icon() && this.icon().length > 0) {
			return this.icon();
		}

		return this._getIconForEmphasis(this.status());
	});

	@HostBinding('class')
	private get _class(): string {
		return this.status();
	}

	private _getIconForEmphasis(status: string): string {
		const iconMap: Record<string, string> = {
			default: 'check',
			brand: 'exclamation',
			tertiary: 'check',
			info: 'exclamation',
			success: 'check',
			warning: 'exclamation',
			error: 'exclamation'
		};

		return iconMap[status];
	}
}
