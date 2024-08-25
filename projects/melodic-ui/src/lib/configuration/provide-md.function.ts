import { InjectionToken } from '@angular/core';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export const MD_ICON_BASE_URL = new InjectionToken<string>('MDIconBaseUrl');

export type MDConfiguration = {
	iconBaseUrl: string; // default: ./public/icons
};

export function provideMD(configuration?: MDConfiguration): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: MD_ICON_BASE_URL,
			useValue: configuration?.iconBaseUrl || './public/icons'
		}
	]);
}
