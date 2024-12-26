export interface IUser {
	userID: number;
	username: string;
	displayName: string;
}

export interface IUserState {
	users: IUser[];
	userByID: IUser | null;
	loading: boolean;
	loaded: boolean;
}

export const initUserState: IUserState = {
	users: [],
	userByID: null,
	loading: false,
	loaded: false
};
