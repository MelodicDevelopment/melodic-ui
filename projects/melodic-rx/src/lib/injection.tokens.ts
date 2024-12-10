import { InjectionToken } from '@angular/core';
import { ActionEffectsMap } from './types/action-effect.types';
import { ActionReducerMap } from './types/reducer-config.type';
import { State } from './types/state.type';

export const INIT_STATE = new InjectionToken<State<object>>('INIT_STATE');
export const ACTION_PROVIDERS = new InjectionToken<ActionReducerMap<object>>('ACTION_PROVIDERS');
export const EFFECTS_PROVIDERS = new InjectionToken<ActionEffectsMap<object>>('EFFECTS_PROVIDERS');
