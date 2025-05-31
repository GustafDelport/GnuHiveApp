import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterOutlet} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [AppComponent//
  ],
  imports: [
    RouterOutlet,
    AppRoutingModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
