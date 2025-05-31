import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestroyableComponent } from '../destroyable-component/destroyable-component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    imports: [
        CommonModule, //
        RouterOutlet
    ],
    standalone: true
})
export class NavigationComponent extends DestroyableComponent {
    constructor() {
        super();
    }
}
