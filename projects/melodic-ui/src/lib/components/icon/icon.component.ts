import { Component, Host, HostBinding, inject, input, InputSignal, OnInit, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { MD_ICON_BASE_URL } from '../../configuration';

// hold icons in memory so we don't have to fetch them multiple times
export const IconCache: { [key: string]: SafeHtml } = {};
export const IconCachePromise: { [key: string]: Promise<SafeHtml> } = {};

@Component({
	selector: 'md-icon',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './icon.component.html',
	styleUrl: './icon.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class MDIconComponent implements OnInit {
	private _http: HttpClient = inject(HttpClient);
	private _sanitizer: DomSanitizer = inject(DomSanitizer);
	private _iconUrlBase: string = inject(MD_ICON_BASE_URL);

	@HostBinding('class.material-icons')
	private _isMaterialIcon = false;

	public icon: InputSignal<string> = input('');
	public iconString: WritableSignal<SafeHtml> = signal('');

	async ngOnInit(): Promise<void> {
		if (this.icon().length > 0) {
			this.iconString.set(await this.getIcon(this.icon()));
		} else {
			this._isMaterialIcon = true;
		}
	}

	private async getIcon(iconName: string): Promise<SafeHtml> {
		if (IconCache[iconName]) {
			return Promise.resolve<SafeHtml>(IconCache[iconName]);
		}

		if (Object.keys(IconCachePromise).includes(iconName)) {
			return await IconCachePromise[iconName];
		}

		const iconPromise = new Promise<SafeHtml>((resolve, reject) => {
			if (IconCache[iconName]) {
				resolve(IconCache[iconName]);
				return;
			}

			this._http
				.get(`${this._iconUrlBase}/${iconName}.svg`, { responseType: 'text' })
				.pipe(take(1))
				.subscribe({
					next: (svgContent) => {
						const svg: SafeHtml = this._sanitizer.bypassSecurityTrustHtml(svgContent);
						IconCache[iconName] = svg;
						resolve(svg);
					},
					error: (error) => {
						console.error('Error loading icon', error);
						reject(error);
					}
				});
		});

		IconCachePromise[iconName] = iconPromise;

		return iconPromise;
	}
}
