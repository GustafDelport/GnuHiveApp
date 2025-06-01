import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestroyableComponent } from '../destroyable-component/destroyable-component';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { CardComponent } from '../card/card.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    imports: [
        CommonModule, //
        RouterOutlet,
        SideNavComponent,
        CardComponent
    ],
    standalone: true
})
export class NavigationComponent extends DestroyableComponent {
    public navigationActive: boolean = false;

    constructor(private readonly _navigationService: NavigationService) {
        super();

        this._navigationService.navigationActive$.subscribe(active => {
            this.navigationActive = active;
        });
    }
}
