import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ActionReducerMap, ActionEffectsMap, INIT_STATE, ACTION_PROVIDERS, EFFECTS_PROVIDERS, SignalStoreService } from '../services/signal-store.service';
import { State } from '../types/state.type';

export function provideMDRX<S extends object>(initState: State<S>, actionReducers: ActionReducerMap<S>, effects: ActionEffectsMap<S>): EnvironmentProviders {
	return makeEnvironmentProviders([
		{ provide: INIT_STATE, useValue: initState },
		{ provide: ACTION_PROVIDERS, useValue: actionReducers },
		{ provide: EFFECTS_PROVIDERS, useValue: effects },
		{ provide: SignalStoreService, useClass: SignalStoreService, deps: [INIT_STATE, ACTION_PROVIDERS, EFFECTS_PROVIDERS] }
	]);
}
