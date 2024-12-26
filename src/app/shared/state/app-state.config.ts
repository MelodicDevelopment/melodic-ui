import { ActionEffectsMap, ActionReducerMap, createAppState } from '@melodic-rx';
import { IGlobalState, initState } from './global.state';
import { userReducers } from './user.reducers';
import { UserEffects } from './user.effects';

export const appState = createAppState<IGlobalState>(initState);

export const actionReducerMap: ActionReducerMap<IGlobalState> = {
	userState: userReducers
};

export const actionEffectsMap: ActionEffectsMap<IGlobalState> = {
	userState: UserEffects
};
