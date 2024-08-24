import { InjectionToken } from '@angular/core';

export * from './content-box/content-box.component';
export * from './header/header.component';
export * from './icon/icon.component';
export * from './progress-bar/progress-bar.component';
export * from './tag/tag.component';

/**
 * used for providing default base url for icons
 * ex: ./public/icons
 */
export const MD_ICON_BASE_URL = new InjectionToken<string>('MDIconBaseUrl');
