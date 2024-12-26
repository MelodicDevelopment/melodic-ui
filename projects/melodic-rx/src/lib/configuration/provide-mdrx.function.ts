import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SignalStoreService } from '../services/signal-store.service';
import { State } from '../types/state.type';
import { MD_INIT_STATE, MD_ACTION_PROVIDERS, MD_EFFECTS_PROVIDERS, MD_STATE_DEBUG } from '../injection.tokens';
import { ActionReducerMap, ActionEffectsMap } from '../types';

export function provideMDRX<S extends object>(
	initState: State<S>,
	actionReducers: ActionReducerMap<S>,
	effects: ActionEffectsMap<S>,
	debug: boolean = false
): EnvironmentProviders {
	return makeEnvironmentProviders([
		{ provide: MD_INIT_STATE, useValue: initState },
		{ provide: MD_ACTION_PROVIDERS, useValue: actionReducers },
		{ provide: MD_EFFECTS_PROVIDERS, useValue: effects },
		{ provide: MD_STATE_DEBUG, useValue: debug },
		{ provide: SignalStoreService, useClass: SignalStoreService, deps: [MD_INIT_STATE, MD_ACTION_PROVIDERS, MD_EFFECTS_PROVIDERS] }
	]);
}
