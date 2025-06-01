import { Component } from '@angular/core';
import { NavigationComponent } from '../components/shared/navigation/navigation.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [
        NavigationComponent //
    ]
})
export class AppComponent {}
