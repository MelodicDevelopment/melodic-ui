import { ActionReducer } from './action-reducer.type';
import { Action } from './action.types';

export type ReducerConfig<S, V extends Action> = {
	reducers: ActionReducer<S, V>[];
};

export type ActionReducerMap<S> = {
	[key in keyof S]?: ReducerConfig<S[key], Action>;
};
