import { createReducer, onAction } from '@melodic-rx';
import { IGlobalState } from './global.state';
import * as userActions from './user.actions';

export const userReducers = createReducer<IGlobalState, 'userState'>(
	onAction(userActions.loadUsers(), (state, action) => {
		return { ...state, users: [], loaded: false, loading: true };
	}),
	onAction(userActions.setUsers(), (state, action) => {
		return { ...state, users: action.payload.users, loaded: true, loading: false };
	}),

	onAction(userActions.loadUserByID(), (state, action) => {
		return { ...state, userByID: undefined, loaded: false, loading: true };
	}),
	onAction(userActions.setUserByID(), (state, action) => {
		return { ...state, userByID: action.payload.user, loaded: true, loading: false };
	})
);
