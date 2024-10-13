import { OverlayModule } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, OverlayModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	title = 'melodic-ui-web';
}
