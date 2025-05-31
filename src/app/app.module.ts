import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NavigationComponent } from './modules/shared/navigation/navigation.component';

@NgModule({
    declarations: [
        AppComponent //
    ],
    imports: [
        RouterOutlet, //
        AppRoutingModule,
        NavigationComponent
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
