import { Routes } from '@angular/router';
import { MelodicUiTestAreaComponent } from './melodic-ui-test-area/melodic-ui-test-area.component';
import { MelodicRxTestAreaComponent } from './melodic-rx-test-area/melodic-rx-test-area.component';

export const routes: Routes = [
	{
		path: '',
		component: MelodicUiTestAreaComponent
	},
	{
		path: 'melodic-rx-test-area',
		component: MelodicRxTestAreaComponent
	}
];
