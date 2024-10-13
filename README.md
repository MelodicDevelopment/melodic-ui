# Melodic UI

This project was started to build out an Angular component library based on the Untitled UI Design System for Figma

## Serving Melodic-UI-Web

Melodic UI Test Area is an angular web app used to test the components. This can be started with the npm run command `npm start`. Then navigate to `http://localhost:4300/`. It runs on port 4300 so as not to interfere with other angular applications which run on port 4200 by default.

## Building Melodic-UI

Run `npm run build:melodic-ui` to build Melodic-UI to the `dist/melodic-ui` directory.

## Publishing Melodic-UI

If you would like to publish a new version of the melodic-ui npm package, first increment the version in the `projects/melodic-ui/package.json` file. Then run `npm run build:melodic-ui`. After the build succeeds navigate to the `dist/melodic-ui` directory (in terminal: cd dist/melodic-ui). After navigating there run `npm publish`. This will push a new version of the package out to the npm repository for use in other applications.

## To use the Melodic UI CSS

There are a few ways to use Melodic UI in your application. A preferred way by the authors of Melodic UI is to modify the angular.json build target configuration by setting the stylePreprocessorOptions --> includePaths value. For example:

```json
"stylePreprocessorOptions": {
	"includePaths": [
		"node_modules/melodic-ui/lib/styles",
		"node_modules/melodic-ui/lib/styles/dsl",
		"node_modules/melodic-ui/lib/styles/dsl/partials"
	]
}
```

This will allow you to do simple imports in your scss files. For example:

```scss
// melodic ui imported in a global.scss
@import 'melodic-ui.scss';
```

...or if you wanted to import just a mixin in your component

```scss
@import 'typography.mixins';
```

All can be found with the includePaths set this way.

There is also a compiled css file which can be imported in the targets --> build --> options --> styles array of your angular.json.

```json
"styles": ["src/styles.scss", "dist/melodic-ui/lib/melodic-ui.css"],
```

## CSS Variables

Please see the `projects/melodic-ui/src/lib/styles/dsl` directory for all the available css variables and mixins.

## Surfaces

Melodic UI uses an idea called surfaces. Surfaces are basically any surface on a webpage and is normally designated with the primary property of background-color. Surfaces have a name and 3 required properties: background-color, border-color, and font-color. Each surface gets these 3 properties defined. Additional properties can be set such as variant border colors, variant font colors, background hover colors, etc. The main differentiator though is the background-color. Melodic UI creates some default surfaces that serve as the basis for the components it offers. Those default surface variables can be seen below.

Example surfaces would be something like the main background of your page. In Melodic UI this is called the primary surface. You can see all the primary surface variables below. You can also have other named surfaces for things like buttons, warning dialogs, whatever... the main differentiator though again is background color. If something has a white background, in Melodic UI that is the primary surface and all css variables for the primary surface should be used to help style.

A surface designates background-color, border-color, and font-color. It is not required that a surface has borders or fonts to color, but they will all have background-color. If however you decided to have borders or fonts, use the associated css variables

## Default Surfaces

```css
:root {
	// primary surface (white)
	--md-surface-primary-background-color: var(--md-colors-base-white);
	--md-surface-primary-background-color-hover: var(--md-colors-gray-50);
	--md-surface-primary-background-color-focus: var(--md-colors-gray-25);
	--md-surface-primary-border-color: var(--md-colors-gray-200);
	--md-surface-primary-border-color-focus: var(--md-colors-gray-50);
	--md-surface-primary-font-color: var(--md-colors-gray-900);
	--md-surface-primary-font-color-hover: var(--md-colors-gray-950);

	// primary surface with alternates
	--md-surface-primary-border-color-brand: var(--md-colors-brand-300);
	--md-surface-primary-border-color-brand-variant: var(--md-colors-brand-600);
	--md-surface-primary-border-color-error: var(--md-colors-error-300);
	--md-surface-primary-font-color-brand: var(--md-colors-brand-600); // links
	--md-surface-primary-font-color-brand-hover: var(--md-colors-brand-400);
	--md-surface-primary-font-color-brand-variant-1: var(--md-colors-brand-900);
	--md-surface-primary-font-color-brand-variant-2: var(--md-colors-brand-700);
	--md-surface-primary-font-color-gray-variant-1: var(--md-colors-gray-700);
	--md-surface-primary-font-color-gray-variant-1-hover: var(--md-colors-gray-800);
	--md-surface-primary-font-color-gray-variant-2: var(--md-colors-gray-600);
	--md-surface-primary-font-color-gray-variant-2-hover: var(--md-colors-gray-700);
	--md-surface-primary-font-color-light: var(--md-colors-gray-200);
	--md-surface-primary-font-color-light-hover: var(--md-colors-gray-300);

	// secondary surface (brand 600 green)
	--md-surface-secondary-background-color: var(--md-colors-brand-600);
	--md-surface-secondary-background-color-hover: var(--md-colors-brand-700);
	--md-surface-secondary-border-color: var(--md-colors-brand-600);
	--md-surface-secondary-font-color: var(--md-colors-base-white);

	// tertiary surface (gray 50)
	--md-surface-tertiary-background-color: var(--md-colors-gray-50);
	--md-surface-tertiary-background-color-hover: var(--md-colors-gray-100);
	--md-surface-tertiary-border-color: var(--md-colors-gray-300);
	--md-surface-tertiary-font-color: var(--md-colors-gray-700);

	// light blue surface (blue 50)
	--md-surface-light-blue-background-color: var(--md-colors-blue-light-50);
	--md-surface-light-blue-background-color-hover: var(--md-colors-blue-light-100);
	--md-surface-light-blue-border-color: var(--md-colors-blue-light-200);
	--md-surface-light-blue-font-color: var(--md-colors-blue-light-700);

	// light blue surface (blue 600)
	--md-surface-light-blue-600-background-color: var(--md-colors-blue-light-600);
	--md-surface-light-blue-600-background-color-hover: var(--md-colors-blue-light-700);
	--md-surface-light-blue-600-border-color: var(--md-colors-blue-light-600);
	--md-surface-light-blue-600-font-color: var(--md-colors-base-white);

	// success surface (brand 25)
	--md-surface-success-background-color: var(--md-colors-brand-25);
	--md-surface-success-background-color-hover: var(--md-colors-brand-100);
	--md-surface-success-border-color: var(--md-colors-brand-300);
	--md-surface-success-font-color: var(--md-colors-brand-700);

	// success surface (success 600)
	--md-surface-success-600-background-color: var(--md-colors-success-600);
	--md-surface-success-600-background-color-hover: var(--md-colors-success-700);
	--md-surface-success-600-border-color: var(--md-colors-success-600);
	--md-surface-success-600-font-color: var(--md-colors-base-white);

	// warning surface (warning 50)
	--md-surface-warning-background-color: var(--md-colors-warning-50);
	--md-surface-warning-background-color-hover: var(--md-colors-warning-100);
	--md-surface-warning-border-color: var(--md-colors-warning-200);
	--md-surface-warning-font-color: var(--md-colors-warning-700);

	// warning surface (warning 600)
	--md-surface-warning-600-background-color: var(--md-colors-warning-600);
	--md-surface-warning-600-background-color-hover: var(--md-colors-warning-700);
	--md-surface-warning-600-border-color: var(--md-colors-warning-600);
	--md-surface-warning-600-font-color: var(--md-colors-base-white);

	// warning alternates
	--md-surface-warning-background-color-variant: var(--md-colors-warning-40);
	--md-surface-warning-border-color-variant: var(--md-colors-warning-590);
	--md-surface-warning-font-color-variant: var(--md-colors-gray-600);

	// error surface (error 25)
	--md-surface-error-background-color: var(--md-colors-error-50);
	--md-surface-error-background-color-hover: var(--md-colors-error-100);
	--md-surface-error-border-color: var(--md-colors-error-200);
	--md-surface-error-font-color: var(--md-colors-error-800);

	// error surface (error 600)
	--md-surface-error-600-background-color: var(--md-colors-error-600);
	--md-surface-error-600-background-color-hover: var(--md-colors-error-700);
	--md-surface-error-600-border-color: var(--md-colors-error-600);
	--md-surface-error-600-font-color: var(--md-colors-base-white);

	// disabled surface (gray 100)
	--md-surface-disabled-background-color: var(--md-colors-gray-100);
	--md-surface-disabled-border-color: var(--md-colors-gray-200);
	--md-surface-disabled-font-color: var(--md-colors-gray-400);

	// green surface variants
	--md-surface-green-50-background-color: var(--md-colors-brand-50);
	--md-surface-green-50-border-color: var(--md-colors-brand-200);
	--md-surface-green-50-font-color: var(--md-colors-brand-800);

	--md-surface-green-100-background-color: var(--md-colors-brand-100);
	--md-surface-green-100-border-color: var(--md-colors-brand-100);
	--md-surface-green-100-font-color: var(--md-colors-brand-800);

	--md-surface-green-200-background-color: var(--md-colors-brand-200);
	--md-surface-green-200-border-color: var(--md-colors-brand-200);
	--md-surface-green-200-font-color: var(--md-colors-brand-800);

	--md-surface-green-300-800-gradient-background-color: linear-gradient(180deg, var(--md-colors-brand-300) 56%, var(--md-colors-brand-800) 100%);

	// overlay surface
	--md-surface-overlay-background-color: var(--md-colors-base-black-transparent);
}
```

## Creating Additional Surfaces

You can create additional surfaces by using the surface mixin. It takes in a surface name, a map of requried properties, and an optional additional map of additional properties. Adding the below script in your main styles file will create a new set of surface variables.

```scss
// Example of creating a surface
@import 'surface.mixins';

$testSurface: (
	'background-color': '#333333',
	'border-color': '#444444',
	'font-color': '#555555'
);

$additionalProps: (
	'border-radius': '4px',
	'padding': '16px'
);

@include surface('test-surface', $testSurface, $additionalProps);
```

This would create

```css
:root {
	--md-surface-test-surface-background-color: #333333;
	--md-surface-test-surface-border-color: #444444;
	--md-surface-test-surface-font-color: #555555;
	--md-surface-test-surface-border-radius: 4px;
	--md-surface-test-surface-padding: 16px;
}
```

## Buttons

Buttons are not angular components in Melodic UI. They are just native HTML button elements with custom styling applied. You can also apply the styling to anchor tags to make them appear as buttons. To utilize this styling you need to add some attributes to your buttons. Those attributes are:

```css
[md-button],
[md-button-link],
[md-button-brand],
[md-button-info],
[md-button-success],
[md-button-warning],
[md-button-error],
[md-button-circle]
```

#### Button Group

There is one custom button component called `md-button-group`. This component is used to group multiple buttons together into an toggle option. The toggle can be single valued or multi-valued.

```html
<md-button-group (change)="buttonToggleChange($event)" value="1">
	<md-button-toggle value="1">Option 1</md-button-toggle>
	<md-button-toggle value="2">Option 2</md-button-toggle>
	<md-button-toggle value="3">Option 3</md-button-toggle>
</md-button-group>
```

Please run the test application Melodic UI Test Area and see the buttons area for examples.

## Form Inputs

Form inputs in Melodic UI are not angular components. They are native HTML input elements with custom styling applied. You can utilize this stylying by adding the `[md-form-input]` to your input elements.

#### Select Input

The select input can be augmented to take advantage of the custom options list. To do this you will need to add the `[md-select-input]` attribute. This attribute is actually an Angular directive which takes over the select customizes the options list.

#### Date Picker

An input with type='date' can have the `[md-date-picker-input]` applied to it along side of `[md-form-input]`. The `[md-date-picker-input]` attribute is actually an Angular directive. It will take over the date input and when clicked will display the custom datepicker component that also comes with Melodic UI.

#### Examples

Please run the test application Melodic UI Test Area and see the input area for examples.

## Components

Melodic UI offers some custom Angular components. Further documentation will be written to show how these work, but for now the best way to learn about them would be to run the Melodic UI Test Area application and see all the examples, and examine the source code.

A couple notes though...

Melodic UI offers a component called MDIconComponent for displaying icons. By default, you can use this with the Material Icons that are shown at [https://fonts.google.com/icons](https://fonts.google.com/icons). You just need to add the correct text associated with the icon you want into the content area of the component. For example:

```html
<md-icon>add</md-icon>
```

In addition to the Material Icons you can utilize the free icons offered by Untitled UI. This takes a little more configuration. First your angular.json will need to have an assets entry that can move the icons from the melodic-ui node_modules folder to your assets directory...

```json
{
	"glob": "**/*",
	"input": "node_modules/melodic-ui/lib/assets",
	"output": "assets"
}
```

You will also need to add the provideMD provider to your app.config. The provideMD allows for setting a base url where the icons can be loaded from...

```javascript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideMD } from '@melodic-ui-dist';

export const appConfig: ApplicationConfig = {
	providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideMD({ iconBaseUrl: './assets/icons' })]
};
```

Then you can use these icons like this:

```html
<md-icon icon="untitled-ui/alerts/alert-triangle"></md-icon>
```

You could also utilize any other icons that are under the `./assets/icons` directory. The icon property value is just the url path of the icon. It is loaded with an fetch request.

## Popups

Popups need a target which is the element that is clicked or hovered over to trigger the popup. Provide a target element and some content for the content area. Popups have 3 Inputs:

```typescript
public trigger: InputSignal<TriggerType> = input<TriggerType>('click');
public position: InputSignal<PositionType> = input<PositionType>('bottom');
public offsets: InputSignal<OffsetType> = input<OffsetType>({ top: 0, left: 0, right: 0, bottom: 0 });
```

```typescript
export type PopupTriggerType = 'click' | 'hover';
export type PopupPositionType =
	| 'left'
	| 'left-top'
	| 'left-bottom'
	| 'right'
	| 'right-top'
	| 'right-bottom'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end';
export type PopupOffsetType = { top?: number; right?: number; bottom?: number; left?: number };
```

```html
<md-popup position="bottom">
	<div popup-target><button md-button>Bottom</button></div>
	<div popup-content>Popup Content</div>
</md-popup>
```

## Menu

The menu component is a form of a popup. It is a brand colored button with a drop down arrow. You can provide it menu options that can be either links or click events. You can also provide it a custom component to be able to further customize how the menu options appear. You can also add the same attributes that are used on Melodic buttons to change the look of the Menu trigger button.

```typescript
export interface IMDMenuOption {
	label: string;
	icon?: string;
	link?: string;
	linkTarget?: string;
	isRouteLink?: boolean;
	click?: actionGetter;
}
```

```typescript
public menuOptions: IMDMenuOption[] = [
		{
			label: 'Menu Item 1',
			icon: 'home',
			click: (item: unknown) => {
				console.log('Menu item 1 clicked', item);
			}
		},
		{
			label: 'Menu Item 2',
			icon: 'favorite',
			click: (item: unknown) => {
				console.log('Menu item 2 clicked', item);
			}
		},
		{
			label: 'Menu Item 3',
			click: (item: unknown) => {
				console.log('Menu item 3 clicked', item);
			}
		},
		{
			label: 'Menu Item 4',
			link: 'https://www.google.com',
			linkTarget: '_blank'
		},
		{
			label: 'Menu Item 5',
			link: 'https://www.tiktok.com'
		}
	];
```

```html
<md-menu [menuItems]="menuOptions"></md-menu>
<md-menu [menuItems]="menuOptions" md-button-warning></md-menu>
<md-menu [menuItems]="menuOptions" md-button-error></md-menu>
<md-menu [menuItems]="menuOptions" md-button-link></md-menu>
```

## Dialogs

Melodic UI offers a way to open dialogs (modals). To use this, inject the MDDialogService into your host component. For example:

```typescript
export class MelodicUiTestAreaComponent {
	private _dialogService: MDDialogService = inject(MDDialogService);

	openDialog(): void {
		const dialogRef = this._dialogService.open(TestDialogOneComponent as Type<Component>);
	}
}
```

This will open up the `TestDialogOneComponent` in a modal dialog window. The opened component can inject the MDDialogRef service using the MD_DIALOG_REF injection token. MDDialogRef is a reference to the opened dialog. This allows access to some signals like afterOpened, and afterClosed as well as access to the close() method. For example:

```typescript
export class TestDialogOneComponent {
	private _dialogRef: MDDialogRef = inject(MD_DIALOG_REF);

	close(): void {
		this._dialogRef.close();
	}
}
```

#### Dialog Architecture

A dialog component like the `TestDialogOneComponent` above should have the following html structure. The header and footer areas are optional, but if the `md-dialog-header` or `md-dialog-footer` directives are used that content will be added to the header and footer.

```html
<md-dialog>
	<div md-dialog-header>Header here</div>

	<div>
		<div>Test Dialog One</div>
		<app-test-dialog-one-inner></app-test-dialog-one-inner>
	</div>

	<div md-dialog-footer>
		<button md-button (click)="close()">Cancel</button>
		<button md-button-brand (click)="close()">Close</button>
	</div>
</md-dialog>
```

Please run the test application Melodic UI Test Area and see the Dialogs area for further examples.
