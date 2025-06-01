import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrl: './side-nav.component.scss',
    imports: [
        CommonModule //
    ],
    standalone: true
})
export class SideNavComponent {}
