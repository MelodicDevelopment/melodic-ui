import { InjectionToken } from '@angular/core';
import { ActionEffectsMap } from './types/action-effect.types';
import { ActionReducerMap } from './types/reducer-config.type';
import { State } from './types/state.type';

export const MD_INIT_STATE = new InjectionToken<State<object>>('MD_INIT_STATE');
export const MD_ACTION_PROVIDERS = new InjectionToken<ActionReducerMap<object>>('MD_ACTION_PROVIDERS');
export const MD_EFFECTS_PROVIDERS = new InjectionToken<ActionEffectsMap<object>>('MD_EFFECTS_PROVIDERS');
export const MD_STATE_DEBUG = new InjectionToken<boolean>('MD_STATE_DEBUG');
