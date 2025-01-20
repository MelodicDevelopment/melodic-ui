import {
	Component,
	ElementRef,
	HostBinding,
	inject,
	input,
	InputSignal,
	OnInit,
	SecurityContext,
	signal,
	ViewEncapsulation,
	WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { MD_ICON_BASE_URL } from '../../configuration';
import { IconRef, IconType } from '../../types';

// hold icons in memory so we don't have to fetch them multiple times
export const IconCache: { [key: string]: SafeHtml } = {};
export const IconCachePromise: { [key: string]: Promise<SafeHtml> } = {};

type IconRefObj = { type: 'material' | 'url'; icon: string };

@Component({
	selector: 'md-icon',
	standalone: true,
	imports: [CommonModule],
	styleUrl: './icon.component.scss',
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None
})
export class MDIconComponent implements OnInit {
	private _http: HttpClient = inject(HttpClient);
	private _sanitizer: DomSanitizer = inject(DomSanitizer);
	private _iconUrlBase: string = inject(MD_ICON_BASE_URL);
	private _elementRef: ElementRef = inject(ElementRef);

	@HostBinding('class.material-icons')
	private _isMaterialIcon = false;

	public icon: InputSignal<IconRef | undefined> = input();
	public iconType: InputSignal<IconType | undefined> = input<IconType | undefined>();

	public iconString: WritableSignal<SafeHtml> = signal('');

	async ngOnInit(): Promise<void> {
		if (!this.icon()) {
			// assume material icon
			this._isMaterialIcon = true;
			return;
		}

		if (typeof this.icon() === 'string') {
			if (this.iconType() === undefined || this.iconType() === 'material') {
				// assume material icon
				this.setIcon(this.icon() as string);
				return;
			}

			// url icon
			this.setIcon(await this.getIcon(this.icon() as string), false);
			return;
		}

		const icon = this.icon() as IconRefObj;

		if (icon.type === 'material') {
			// material icon
			this.setIcon(icon.icon);
			return;
		}

		this.setIcon(await this.getIcon(icon.icon), false);
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

	private setIcon(icon: string | SafeHtml, isMaterial: boolean = true): void {
		this._isMaterialIcon = isMaterial;
		(this._elementRef.nativeElement as HTMLElement).innerHTML = this._sanitizer.sanitize(SecurityContext.HTML, icon) as string;
	}
}
