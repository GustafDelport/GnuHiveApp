import { Routes } from '@angular/router';
import { NotFoundComponent } from '../components/shared/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: NotFoundComponent
    },
    { path: '**', component: NotFoundComponent }
];
