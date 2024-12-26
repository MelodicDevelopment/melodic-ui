import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject, Signal } from '@angular/core';
import { MD_COMPONENTS } from '../shared/md-components';
import { MD_DIRECTIVES } from '../shared/md-directives';
import { SignalStoreService } from '@melodic-rx';
import { IGlobalState } from '../shared/state/global.state';
import { loadUserByID, loadUsers } from '../shared/state/user.actions';
import { IUser } from '../shared/state/user.state';

@Component({
	selector: 'app-melodic-rx-test-area',
	standalone: true,
	imports: [CommonModule, MD_COMPONENTS, MD_DIRECTIVES],
	templateUrl: './melodic-rx-test-area.component.html',
	styleUrl: './melodic-rx-test-area.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelodicRxTestAreaComponent implements OnInit {
	private _signalStoreService: SignalStoreService<IGlobalState> = inject(SignalStoreService<IGlobalState>);

	public users: Signal<IUser[]> = this._signalStoreService.select('userState', (state) => state.users);
	public userByID: Signal<IUser | undefined> = this._signalStoreService.select('userState', (state) => state.userByID);
	public usersLoading: Signal<boolean> = this._signalStoreService.select('userState', (state) => state.loading);
	public usersLoaded: Signal<boolean> = this._signalStoreService.select('userState', (state) => state.loaded);

	ngOnInit(): void {
		this._signalStoreService.dispatch('userState', loadUsers());
	}

	loadUserByID(): void {
		const index = Math.floor(Math.random() * this.users().length);
		this._signalStoreService.dispatch('userState', loadUserByID({ userID: this.users()[index].userID }));
	}
}
