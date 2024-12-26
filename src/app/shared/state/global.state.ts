import { IUserState, initUserState } from './user.state';

export interface IGlobalState {
	userState: IUserState;
}

export const initState: IGlobalState = {
	userState: initUserState
};
