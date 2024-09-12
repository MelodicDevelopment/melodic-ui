import { Component, Host, HostBinding, inject, input, InputSignal, OnInit, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, take, map, catchError, of } from 'rxjs';
import { MD_ICON_BASE_URL } from '../../configuration';

// hold icons in memory so we don't have to fetch them multiple times
const IconCache: { [key: string]: SafeHtml } = {};

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

	@HostBinding('class.material-icons') private _isMaterialIcon = false;

	public icon: InputSignal<string> = input('');
	public iconString: WritableSignal<SafeHtml> = signal('');

	async ngOnInit(): Promise<void> {
		if (this.icon().length > 0) {
			this.iconString.set(await this.getIcon(this.icon()));
		} else {
			this._isMaterialIcon = true;
		}
	}

	private getIcon(iconName: string): Promise<SafeHtml> {
		if (IconCache[iconName]) {
			return Promise.resolve(IconCache[iconName]);
		}

		return firstValueFrom(
			this._http.get(`${this._iconUrlBase}/${iconName}.svg`, { responseType: 'text' }).pipe(
				take(1),
				map((svgContent) => {
					const svg: SafeHtml = this._sanitizer.bypassSecurityTrustHtml(svgContent);
					IconCache[iconName] = svg;

					return svg;
				}),
				catchError((error) => {
					console.error('Error loading icon', error);
					return of(``);
				})
			)
		);
	}
}
