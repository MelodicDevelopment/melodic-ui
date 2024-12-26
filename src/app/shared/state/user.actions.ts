import { IUser } from './user.state';
import { createAction, props } from '@melodic-rx';

export const loadUsers = createAction('[Users] load users', props());
export const setUsers = createAction('[Users] set users', props<{ users: IUser[] }>());

export const loadUserByID = createAction('[Users] load user by ID', props<{ userID: number }>());
export const setUserByID = createAction('[Users] set user by ID', props<{ user: IUser | undefined }>());
