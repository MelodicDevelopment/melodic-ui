import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Data, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';

interface IRoutePath {
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

				while (activeRoute.firstChild) {
					activeRoute = activeRoute.firstChild;

					let path = activeRoute.routeConfig?.path;
					Object.keys(activeRoute.snapshot.params).forEach((param) => {
						const value = activeRoute.snapshot.params[param];
						path = activeRoute.routeConfig?.path?.replace(`:${param}`, value);
					});

					paths.push({
						path: path || '',
						rawPath: activeRoute.routeConfig?.path || '',
						title: activeRoute.snapshot.title,
						data: activeRoute.snapshot.data
					});
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
			});
	}
}
