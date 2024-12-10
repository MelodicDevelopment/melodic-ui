import { Signal } from '@angular/core';

export type State<P extends object> = {
	[K in keyof P]: Signal<P[K]>;
};
