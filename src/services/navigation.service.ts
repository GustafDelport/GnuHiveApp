import { Injectable } from '@angular/core';
import { DestroyableComponent } from '../components/shared/destroyable-component/destroyable-component';
import { NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { routes } from '../app/app.routes';
import { routesConfig } from '../config/routes.config';

@Injectable({
    providedIn: 'root'
})
export class NavigationService extends DestroyableComponent {
    public navigationActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(
        private readonly _router: Router //
    ) {
        super();
        this.setupNavigationViewListener();
    }

    private setupNavigationViewListener() {
        this._router.events
            .pipe(
                filter(val => val instanceof NavigationEnd || val instanceof NavigationSkipped),
                this.untilDestroyed()
            )
            .subscribe((val: NavigationEnd | NavigationSkipped) => {
                this.navigationActive$.next(!val.url.includes(routesConfig.login.root.route));
            });
    }
}
