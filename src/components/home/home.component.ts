import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CardComponent],
    standalone: true
})
export class HomeComponent {
    public userName: string = 'Gustaf Delport';
}
