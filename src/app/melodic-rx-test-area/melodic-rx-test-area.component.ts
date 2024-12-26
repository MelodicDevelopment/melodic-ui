import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { SignalStoreService } from '@melodic-rx';
import { IGlobalState } from '../shared/state/global.state';
import { loadUsers } from '../shared/state/user.actions';

@Component({
	selector: 'app-melodic-rx-test-area',
	standalone: true,
	imports: [CommonModule, MD_COMPONENTS, MD_DIRECTIVES],
	templateUrl: './melodic-rx-test-area.component.html',
	styleUrl: './melodic-rx-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicRxTestAreaComponent implements OnInit {
	private _signalStoreService: SignalStoreService<IGlobalState> = inject(SignalStoreService);

	ngOnInit(): void {
		console.log('MelodicRxTestAreaComponent initialized');
		this._signalStoreService.dispatch('userState', loadUsers());
	}
}
