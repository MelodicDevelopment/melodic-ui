import { Action } from './action.types';

export type ActionReducer<S, V extends Action> = {
	action: V;
	reducer: (state: S, action: V) => S;
};
