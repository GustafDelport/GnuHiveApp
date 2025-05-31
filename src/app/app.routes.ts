import { Routes } from '@angular/router';
import { NotFoundComponent } from '../components/shared/not-found/not-found.component';
import { HomeComponent } from '../components/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent
    },
    { path: '**', component: NotFoundComponent }
];
