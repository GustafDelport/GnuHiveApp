import { Injectable } from '@angular/core';
import { DestroyableComponent } from '../components/shared/destroyable-component/destroyable-component';

@Injectable(
  {
    providedIn: "root"
  }
)
export class NavigationService extends DestroyableComponent {

  constructor(
    private readonly _router: Router //
  ) {
    super();
  }
}
