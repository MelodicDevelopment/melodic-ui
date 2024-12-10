import { signal } from '@angular/core';
import { State } from '../types/state.type';

export const createAppState = <P extends object>(initState: P): State<P> => {
	const state: State<P> = {} as State<P>;

	Object.keys(initState).forEach((key) => {
		state[key as keyof P] = signal(initState[key as keyof P]);
	});

	return state;
};
