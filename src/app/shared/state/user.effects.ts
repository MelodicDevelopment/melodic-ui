import { inject, Injectable } from '@angular/core';
import { EffectsBase } from '@melodic-rx';
import { take } from 'rxjs';
import { loadUsers, setUsers } from './user.actions';
import { HttpClient } from '@angular/common/http';
import { IUser } from './user.state';

@Injectable({
	providedIn: 'any'
})
export class UserEffects extends EffectsBase {
	private _http: HttpClient = inject(HttpClient);

	constructor() {
		super();

		this.addEffect([loadUsers()], (_) => {
			return new Promise((resolve, reject) => {
				this._http
					.get<IUser[]>('public/users.json')
					.pipe(take(1))
					.subscribe({
						next: (users: IUser[]) => {
							resolve(setUsers({ users }));
						},
						error: (error) => {
							console.error('Error loading users', error);
							reject(error);
						}
					});
			});
		});
	}
}
