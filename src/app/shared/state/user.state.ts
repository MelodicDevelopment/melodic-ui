export interface IUser {
	userID: number;
	username: string;
	displayName: string;
}

export interface IUserState {
	users: IUser[];
	loading: boolean;
	loaded: boolean;
}

export const initUserState: IUserState = {
	users: [],
	loading: false,
	loaded: false
};
