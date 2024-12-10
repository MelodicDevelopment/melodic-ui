# Melodic RX

## Installation

_NOTE_: Currently in alpha testing so you will need to put the exact version.

npm install --save melodic-rx@0.0.1-alpha.1

## Usage

MelodicRX is meant to look very much like NGRX and uses familiar terminology to every state management library out there with Actions, Reducers, Selectors, and Effects.

Here is an example implementation.

In this example, we are working on an online course app for teaching foreign languages to students. Let's say we have a global state and part of that state is called "lessonState". This lessonState has a property called "lessonTypes" which is an array of ILessonType.

First we can define our application state:

#### Application State

```typescript
import { createAppState, ActionReducerMap, ActionEffectsMap } from 'melodic-rx';
import { ILessonType } from '@myapp/interfaces/ilesson-type.interface';
import { lessonReducers } from './reducers/lesson.reducers';
import { LessonEffects } from './effects/lesson.effects';

export interface ILessonState {
	lessonTypes: ILessonType[];
	loading: boolean;
}

export interface IGlobalState {
	lessonState: ILessonState;
}

export const initState: IGlobalState = {
	lessonState: {
		lessonTypes: [],
		loading: false
	}
};

export const appState = createAppState<IGlobalState>(initState);

// see reducers in docs below
export const actionReducerMap: ActionReducerMap<IGlobalState> = {
	lessonState: lessonReducers
};

// see effects in docs below
export const actionEffectsMap: ActionEffectsMap<IGlobalState> = {
	lessonState: LessonEffects
};
```

With application state defined, lets create our actions:

#### Actions

```typescript
import { ILessonType } from '@myapp/interfaces/ilesson-type.interface';
import { createAction, props } from 'melodic-rx';

export const loadLessonTypes = createAction('[Lessons] load lesson types', props());
export const setLessonTypes = createAction('[Lessons] set loaded lesson types', props<{ lessonTypes: ILessonType[] }>());
```

Now let's define the reducers for these actions:

#### Reducers

```typescript
import { createReducer, onAction } from 'melodic-rx';
import { IGlobalState } from '../application-state';
import * as lessonActions from '../actions/lesson.actions';

export const lessonReducers = createReducer<IGlobalState, 'lessonState'>(
	onAction(lessonActions.loadLessonTypes(), (state, action) => {
		return { ...state, loading: true };
	}),
	onAction(lessonActions.setLessonTypes(), (state, action) => {
		return { ...state, lessonTypes: action.payload.lessonTypes, loading: false };
	})
);
```

Now let's define the effects that can fire as side effects of actions that are dispatched:

#### Effects

```typescript
import { Injectable, inject } from '@angular/core';
import { EffectsBase } from 'melodic-rx';
import { take } from 'rxjs';
import { loadLessonTypes, setLessonTypes } from '../actions/lesson.actions';
import { LessonService } from '@myap/api/services/lesson.service';
import { ILessonType } from '@myapp/interfaces/ilesson-type.interface';

@Injectable({
	providedIn: 'any'
})
export class LessonEffects extends EffectsBase {
	private _lessonService: LessonService = inject(LessonService);

	constructor() {
		super();

		this.addEffect([loadLessonTypes()], (_) => {
			return new Promise((resolve, reject) => {
				this._lessonService
					.getLessonTypes()
					.pipe(take(1))
					.subscribe({
						next: (lessonTypes: ILessonType[]) => {
							resolve(setLessonTypes({ lessonTypes }));
						},
						error: (error) => {
							console.error('Error loading lesson types', error);
							reject(error);
						}
					});
			});
		});
	}
}
```

With the application state, actions, reducers, and effects defined let's configure our app to use them. In your app.config.ts you can add these lines:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appRoutes } from './app.routes';
import { provideMDRX } from 'melodic-rx';
import { actionEffectsMap, actionReducerMap, appState } from './shared/state/application-state';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes),
		provideHttpClient(),
		provideAnimationsAsync(),
		provideMDRX(appState, actionReducerMap, actionEffectsMap)
	]
};
```

Now that the application is configured to use the different MelodicRX pieces, let's see an example of dispatching actions:

#### Dispatching Actions

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { SignalStoreService } from 'melodic-rx';
import { IGlobalState } from './shared/state/application-state';
import { loadLessonTypes } from './shared/state/actions/lesson.actions';

@Component({
	standalone: true,
	selector: 'instr-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	private _signalStore: SignalStoreService<IGlobalState> = inject(SignalStoreService);

	ngOnInit(): void {
		this._signalStore.dispatch('lessonState', loadLessonTypes());
		this._signalStore.dispatch('lessonState', loadAttendanceStatuses());
	}
}
```

...And here is an example of selecting a portion of state...

#### Selecting State

```typescript
import { Component, computed, inject, input, output, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILessonType } from '@myapp/interfaces/ilesson-type.interface';
import { IGlobalState } from '../../../../shared/state/application-state';
import { SignalStoreService } from 'melodic-rx';

@Component({
	selector: 'instr-lesson-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './lesson-card.component.html',
	styleUrl: './lesson-card.component.scss'
})
export class LessonCardComponent {
	private _signalStore: SignalStoreService<IGlobalState> = inject(SignalStoreService);

	lessonTypes: Signal<ILessonType[]> = this._signalStore.select('lessonState', (state) => state.lessonTypes);
}
```

#### Folder Structure

-   app/shared/state
    -   actions
        -   lesson.actions.ts
    -   effects
        -   lesson.effects.ts
    -   reducers
        -   lesson.reducers.ts
    -   application.state.ts

## More To Come...

Obviously this is a pretty simplistic implementation at the moment. There is more to come.
