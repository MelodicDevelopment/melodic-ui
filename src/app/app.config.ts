import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideMD } from '@melodic-ui';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		importProvidersFrom(BrowserAnimationsModule),
		provideRouter(routes),
		provideHttpClient(),
		provideMD({ iconBaseUrl: './public/icons' })
	]
};
