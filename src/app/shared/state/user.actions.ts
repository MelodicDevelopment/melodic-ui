import { IUser } from './user.state';
import { createAction, props } from '@melodic-rx';

export const loadUsers = createAction('[Users] load users', props());
export const setUsers = createAction('[Users] set users', props<{ users: IUser[] }>());
