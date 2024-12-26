import { Type } from '@angular/core';
import { Action } from './action.types';

export type ActionEffect = {
	actions: Action[];
	effect: (action: Action) => Promise<Action | Action[]>;
};

export type ActionEffects = {
	getEffects(): ActionEffect[];
};

export type ActionEffectsMap<S> = {
	[key in keyof S]?: Type<ActionEffects>;
};
