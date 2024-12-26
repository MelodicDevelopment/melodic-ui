import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideMDUI } from '@melodic-ui';
import { provideMDRX } from '@melodic-rx';
import { appState, actionReducerMap, actionEffectsMap } from './shared/state/app-state.config';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		importProvidersFrom(BrowserAnimationsModule),
		provideRouter(routes),
		provideHttpClient(),
		provideMDUI({ iconBaseUrl: './public/icons' }),
		provideMDRX(appState, actionReducerMap, actionEffectsMap)
	]
};
