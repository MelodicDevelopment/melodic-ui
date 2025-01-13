import { inject, Injectable, Type } from '@angular/core';
import { EffectsBase, SignalStoreService, TypedAction } from '@melodic-rx';
import { take } from 'rxjs';
import { loadUsers, setUsers, loadUserByID, setUserByID } from './user.actions';
import { HttpClient } from '@angular/common/http';
import { IUser } from './user.state';
import { IGlobalState } from './global.state';

@Injectable({
	providedIn: 'any'
})
export class UserEffects extends EffectsBase {
	private _http: HttpClient = inject(HttpClient);
	private _signalStoreService: SignalStoreService<IGlobalState> = inject(SignalStoreService<IGlobalState>);

	constructor() {
		super();

		this.addEffect([loadUsers()], (_) => {
			return new Promise((resolve, reject) => {
				this._http
					.get<IUser[]>('public/users.json')
					.pipe(take(1))
					.subscribe({
						next: (users: IUser[]) => {
							debugger;
							resolve([setUsers({ users }), setUserByID({ user: users.find((user) => user.userID === 1) })]);
						},
						error: (error) => {
							console.error('Error loading users', error);
							reject(error);
						}
					});
			});
		});

		this.addEffect([loadUserByID()], (action) => {
			return new Promise((resolve, reject) => {
				debugger;
				const users = this._signalStoreService.select('userState', (state) => state.users)();
				resolve(setUserByID({ user: users.find((user) => user.userID === action.payload.userID) }));
			});
		});
	}
}
