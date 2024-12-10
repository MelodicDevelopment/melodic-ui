import { ActionReducer } from '../types/action-reducer.type';
import { Action } from '../types/action.types';
import { ReducerConfig } from '../types/reducer-config.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createReducer = <S, K extends keyof S>(...actionReducers: ActionReducer<S[K], any>[]): ReducerConfig<S[K], Action> => {
	return { reducers: actionReducers };
};
