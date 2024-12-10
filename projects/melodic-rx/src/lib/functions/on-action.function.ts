import { ActionReducer } from '../types/action-reducer.type';
import { Action } from '../types/action.types';

export const onAction = <S, V extends Action>(action: V, reducer: (state: S, action: V) => S): ActionReducer<S, V> => {
	return {
		action,
		reducer
	};
};
