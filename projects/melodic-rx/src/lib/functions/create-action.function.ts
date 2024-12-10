import { TypedAction } from '../types/action.types';

export const props = <P extends object>(): (() => P) => {
	return () => ({}) as P;
};

export const createAction = <T extends string, P extends object>(type: T, payloadFn: () => P): ((payload?: P) => TypedAction<T, P>) => {
	return (payload?: P) => ({ type, payload: payload || payloadFn() });
};
