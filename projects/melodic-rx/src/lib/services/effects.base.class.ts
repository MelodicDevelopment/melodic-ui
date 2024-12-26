import { ActionEffect, ActionEffects } from '../types/action-effect.types';
import { Action } from '../types/action.types';

export abstract class EffectsBase implements ActionEffects {
	private _effects: ActionEffect[] = [];

	protected addEffect(actions: Action[], effect: (action: Action) => Promise<Action | Action[]>): void {
		this._effects.push({ actions, effect });
	}

	public getEffects(): ActionEffect[] {
		return this._effects;
	}
}
