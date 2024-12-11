import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Data, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class RouterService {
	private _router: Router = inject(Router);
	private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

	public routeData: WritableSignal<Data> = signal<Data>({});
	public queryParams: WritableSignal<Params> = signal<Params>({});
	public routeParams: WritableSignal<Params> = signal<Params>({});

	constructor() {
		this._router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this._activatedRoute)
			)
			.subscribe((route) => {
				// Navigate through child routes to find the active route
				let activeRoute = route;
				while (activeRoute.firstChild) {
					activeRoute = activeRoute.firstChild;
				}

				const routeData = activeRoute.snapshot.data;
				const queryParams = activeRoute.snapshot.queryParams;
				const routeParams = activeRoute.snapshot.params;

				this.routeData.set(routeData);
				this.queryParams.set(queryParams);
				this.routeParams.set(routeParams);
			});
	}
}
