import { Routes } from '@angular/router';
import { MelodicUiTestAreaComponent } from './melodic-ui-test-area/melodic-ui-test-area.component';
import { MelodicRxTestAreaComponent } from './melodic-rx-test-area/melodic-rx-test-area.component';

export const routes: Routes = [
	{
		path: '',
		component: MelodicUiTestAreaComponent,
		title: 'Home'
	},
	{
		path: 'test',
		component: MelodicUiTestAreaComponent,
		children: [
			{
				path: 'test1',
				component: MelodicUiTestAreaComponent,
				title: 'Test 1'
			},
			{
				path: 'test2',
				component: MelodicUiTestAreaComponent,
				title: 'Test 2'
			},
			{
				path: 'test3',
				component: MelodicUiTestAreaComponent,
				title: 'Test 3',
				children: [
					{
						path: 'a',
						component: MelodicUiTestAreaComponent,
						title: 'Test 3: A'
					},
					{
						path: 'b',
						component: MelodicUiTestAreaComponent,
						title: 'Test 3: B'
					},
					{
						path: 'c',
						component: MelodicUiTestAreaComponent,
						title: 'Test 3: C'
					}
				]
			}
		]
	},
	{
		path: 'melodic-rx-test-area',
		component: MelodicRxTestAreaComponent
	}
];
