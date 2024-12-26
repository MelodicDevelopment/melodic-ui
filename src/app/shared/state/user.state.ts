export interface IUser {
	userID: number;
	username: string;
	displayName: string;
}

export interface IUserState {
	users: IUser[];
	userByID: IUser | undefined;
	loading: boolean;
	loaded: boolean;
}

export const initUserState: IUserState = {
	users: [],
	userByID: undefined,
	loading: false,
	loaded: false
};
