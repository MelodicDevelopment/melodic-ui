import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Data, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export interface IRoutePath {
	path: string;
	rawPath: string;
	title?: string;
	data?: Data;
}

@Injectable({
	providedIn: 'root'
})
export class RouterService {
	private _router: Router = inject(Router);
	private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	public routeData: WritableSignal<Data> = signal<Data>({});
	public queryParams: WritableSignal<Params> = signal<Params>({});
	public routeParams: WritableSignal<Params> = signal<Params>({});
	public routePath: WritableSignal<IRoutePath[]> = signal<IRoutePath[]>([]);
	public activeRoute: WritableSignal<ActivatedRoute> = signal<ActivatedRoute>({} as ActivatedRoute);

	constructor() {
		this._router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this._activatedRoute)
			)
			.subscribe((route) => {
				const paths: IRoutePath[] = [];

				// Navigate through child routes to find the active route
				let activeRoute = route;
				let currentPath = '';

				while (activeRoute.firstChild) {
					activeRoute = activeRoute.firstChild;

					let path = `${currentPath}/${activeRoute.routeConfig?.path}`;

					if (path === '/') {
						continue;
					}

					Object.keys(activeRoute.snapshot.params).forEach((param) => {
						const value = activeRoute.snapshot.params[param];
						path = path?.replace(`:${param}`, value);
					});

					paths.push({
						path: path || '',
						rawPath: activeRoute.routeConfig?.path || '',
						title: activeRoute.snapshot.title,
						data: activeRoute.snapshot.data
					});

					currentPath = path;
				}

				const rootPathIndex = paths.findIndex((path) => path.path === '');
				const rootPath = this._router.config.find((route) => route.path === '');
				if (rootPathIndex === -1 || rootPathIndex > 0) {
					paths.unshift({
						path: '',
						rawPath: rootPath?.path as string,
						title: rootPath?.title as string,
						data: rootPath?.data
					});
				}

				const routeData = activeRoute.snapshot.data;
				const queryParams = activeRoute.snapshot.queryParams;
				const routeParams = activeRoute.snapshot.params;
				const routePath = paths;

				this.routeData.set(routeData);
				this.queryParams.set(queryParams);
				this.routeParams.set(routeParams);
				this.routePath.set(routePath);
				this.activeRoute.set(activeRoute);
			});
	}
}
