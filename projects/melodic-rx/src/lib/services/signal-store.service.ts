import { computed, Signal, WritableSignal, Injectable, inject, Injector } from '@angular/core';
import { State } from '../types/state.type';
import { Action, TypedAction } from '../types/action.types';
import { ActionEffect, ActionEffects, ActionEffectsMap } from '../types/action-effect.types';
import { ActionReducerMap } from '../types/reducer-config.type';
import { MD_INIT_STATE, MD_ACTION_PROVIDERS, MD_EFFECTS_PROVIDERS, MD_STATE_DEBUG } from '../injection.tokens';
import { ActionReducer } from '../types/action-reducer.type';

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

	dispatch<T extends string, P extends object>(action: TypedAction<T, P>): void;
	dispatch<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): void;
	dispatch<K extends keyof S, T extends string, P extends object>(x: K | TypedAction<T, P>, y?: TypedAction<T, P>): void {
		const key = typeof x === 'string' ? x : undefined;
		const action: TypedAction<T, P> = (typeof x === 'string' ? y : x) as TypedAction<T, P>;

		if (this._debug) {
			console.log(`Action: ${action.type}`);
			console.log(`Payload:`, action.payload);
			console.log(`Current State:`, this.getCurrentState());
		}

		if (key) {
			this.dispatchWithKey(key, action);
		} else {
			this.dispatchWithoutKey(action);
		}
	}

	private dispatchWithKey<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): void {
		if (!this._reducerMap[key]) {
			throw new Error(`Reducer not found for key: ${key as string}`);
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

		const actionEffects: ActionEffect[] = this.getEffectsForAction(key, action);
		actionEffects.forEach((effect) => {
			effect.effect(action).then((newAction) => {
				if (!Array.isArray(newAction)) {
					newAction = [newAction];
				}

				newAction.forEach((na) => {
					this.dispatch(na as TypedAction<string, object>);
				});
			});
		});
	}

	private dispatchWithoutKey<T extends string, P extends object>(action: TypedAction<T, P>): void {
		const reducerWithKey = this.getReducerForAction(action);
		if (reducerWithKey !== undefined) {
			const newState = reducerWithKey.actionReducer.reducer(this._state[reducerWithKey.key](), action);
			(this._state[reducerWithKey.key] as WritableSignal<S[keyof S]>).set(newState);

			if (this._debug) {
				console.log(`New State:`, this.getCurrentState());
			}
		}

		const effectsWithKey = this.getEffectsForAction(action);
		if (effectsWithKey !== undefined) {
			effectsWithKey.actionEffects.forEach((effect) => {
				effect.effect(action).then((newAction) => {
					if (!Array.isArray(newAction)) {
						newAction = [newAction];
					}

					newAction.forEach((na) => {
						this.dispatch(na as TypedAction<string, object>);
					});
				});
			});
		}
	}

	private getReducerForAction<T extends string, P extends object>(
		action: TypedAction<T, P>
	): { key: keyof S; actionReducer: ActionReducer<S[keyof S], Action> } | undefined {
		const keys: (keyof S)[] = Object.keys(this._reducerMap) as (keyof S)[];

		for (let key of keys) {
			const reducers = this._reducerMap[key]?.reducers || [];
			const reducer = reducers.find((reducer) => reducer.action.type === action.type);

			if (reducer) {
				return { key, actionReducer: reducer };
			}
		}

		return undefined;
	}

	private getEffectsForAction<T extends string, P extends object>(action: TypedAction<T, P>): { key: keyof S; actionEffects: ActionEffect[] } | undefined;
	private getEffectsForAction<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): ActionEffect[];
	private getEffectsForAction<K extends keyof S, T extends string, P extends object>(
		key: K | TypedAction<T, P>,
		action?: TypedAction<T, P>
	): ActionEffect[] | { key: keyof S; actionEffects: ActionEffect[] } | undefined {
		if (typeof key === 'string') {
			return this.getEffectsForActionWithKey(key as K, action as TypedAction<T, P>);
		} else {
			return this.getEffectsForActionWithoutKey(key as TypedAction<T, P>);
		}
	}

	private getEffectsForActionWithoutKey<T extends string, P extends object>(
		action: TypedAction<T, P>
	): { key: keyof S; actionEffects: ActionEffect[] } | undefined {
		const keys: (keyof S)[] = Object.keys(this._reducerMap) as (keyof S)[];

		for (let key of keys) {
			const effectClass = this._effectMap[key];

			if (effectClass) {
				const effectService: ActionEffects = this._injector.get(effectClass);
				const effects = effectService.getEffects().filter((effect) => effect.actions.some((a) => a.type === action.type));

				if (effects.length > 0) {
					return { key, actionEffects: effects };
				}
			}
		}

		return undefined;
	}

	private getEffectsForActionWithKey<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): ActionEffect[] {
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
