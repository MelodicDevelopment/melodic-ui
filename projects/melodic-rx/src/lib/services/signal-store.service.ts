import { computed, Signal, WritableSignal, Injectable, inject, Injector } from '@angular/core';
import { State } from '../types/state.type';
import { TypedAction } from '../types/action.types';
import { ActionEffect, ActionEffects, ActionEffectsMap } from '../types/action-effect.types';
import { ActionReducerMap } from '../types/reducer-config.type';
import { MD_INIT_STATE, MD_ACTION_PROVIDERS, MD_EFFECTS_PROVIDERS, MD_STATE_DEBUG } from '../injection.tokens';

@Injectable()
export class SignalStoreService<S extends object> {
	private _injector: Injector = inject(Injector);
	private _state: State<S> = inject(MD_INIT_STATE) as State<S>;
	private _reducerMap: ActionReducerMap<S> = inject(MD_ACTION_PROVIDERS) as ActionReducerMap<S>;
	private _effectMap: ActionEffectsMap<S> = inject(MD_EFFECTS_PROVIDERS) as ActionEffectsMap<S>;
	private _debug: boolean = inject(MD_STATE_DEBUG) as boolean;

	constructor() {
		if (this._debug) {
			console.info('Melodic RX State Debugging: Enabled');
		}
	}

	select<T, K extends keyof S>(key: K, selectFn: (state: S[K]) => T): Signal<T> {
		return computed(() => {
			return selectFn(this._state[key]());
		});
	}

	logState(): void {
		console.log(this.getCurrentState());
	}

	dispatch<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): void {
		if (!this._reducerMap[key]) {
			throw new Error(`Reducer not found for key: ${key as string}`);
		}

		if (this._debug) {
			console.log(`Action: ${action.type}`);
			console.log(`Payload:`, action.payload);
			console.log(`Current State:`, this.getCurrentState());
		}

		const reducers = this._reducerMap[key].reducers;

		const reducer = reducers.find((reducer) => reducer.action.type === action.type);
		if (reducer !== undefined) {
			const newState = reducer.reducer(this._state[key](), action);
			(this._state[key] as WritableSignal<S[K]>).set(newState);

			if (this._debug) {
				console.log(`New State:`, this.getCurrentState());
			}
		}

		const actionEffects: ActionEffect[] = this.getEffects(key, action);
		actionEffects.forEach((effect) => {
			effect.effect(action).then((newAction) => {
				if (!Array.isArray(newAction)) {
					newAction = [newAction];
				}

				newAction.forEach((na) => {
					this.dispatch(key, na as TypedAction<string, object>);
				});
			});
		});
	}

	private getEffects<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): ActionEffect[] {
		const effectClass = this._effectMap[key as keyof S];
		if (effectClass) {
			const effectService: ActionEffects = this._injector.get(effectClass);
			return effectService.getEffects().filter((effect) => effect.actions.some((a) => a.type === action.type));
		}

		return [];
	}

	private getCurrentState(): S {
		return Object.keys(this._state).reduce((acc, key) => {
			acc[key as keyof S] = this._state[key as keyof S]();
			return acc;
		}, {} as S);
	}
}
