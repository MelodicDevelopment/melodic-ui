# MelodicUiWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## To use the Melodic UI CSS

"styles": ["src/styles.scss", "dist/melodic-ui/lib/melodic-ui.css"],

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
