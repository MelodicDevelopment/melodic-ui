export type Action = {
	type: string;
	payload?: any;
};

export type TypedAction<T extends string, P extends object> = Action & {
	readonly type: T;
	payload: P;
};
