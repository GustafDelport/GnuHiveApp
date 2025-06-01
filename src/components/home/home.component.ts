import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        CardComponent, //
        MatButtonToggle,
        MatSlideToggle
    ],
    standalone: true
})
export class HomeComponent {
    public userName: string = 'Gustaf Delport';
}
