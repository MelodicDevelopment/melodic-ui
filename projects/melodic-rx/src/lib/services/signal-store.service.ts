import { computed, Signal, WritableSignal, Injectable, inject, Injector } from '@angular/core';
import { State } from '../types/state.type';
import { TypedAction } from '../types/action.types';
import { ActionEffect, ActionEffects, ActionEffectsMap } from '../types/action-effect.types';
import { ActionReducerMap } from '../types/reducer-config.type';
import { INIT_STATE, ACTION_PROVIDERS, EFFECTS_PROVIDERS } from '../injection.tokens';

@Injectable()
export class SignalStoreService<S extends object> {
	private _injector: Injector = inject(Injector);
	private _state: State<S> = inject(INIT_STATE) as State<S>;
	private _reducerMap: ActionReducerMap<S> = inject(ACTION_PROVIDERS) as ActionReducerMap<S>;
	private _effectMap: ActionEffectsMap<S> = inject(EFFECTS_PROVIDERS) as ActionEffectsMap<S>;

	select<T, K extends keyof S>(key: K, selectFn: (state: S[K]) => T): Signal<T> {
		return computed(() => {
			return selectFn(this._state[key]());
		});
	}

	logState(): void {
		console.log(Object.keys(this._state).map((key) => ({ [key]: this._state[key as keyof S]() })));
	}

	dispatch<K extends keyof S, T extends string, P extends object>(key: K, action: TypedAction<T, P>): void {
		if (!this._reducerMap[key]) {
			throw new Error(`Reducer not found for key: ${key as string}`);
		}

		const reducers = this._reducerMap[key].reducers;

		const reducer = reducers.find((reducer) => reducer.action.type === action.type);
		if (reducer !== undefined) {
			const newState = reducer.reducer(this._state[key](), action);
			(this._state[key] as WritableSignal<S[K]>).set(newState);
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
}
