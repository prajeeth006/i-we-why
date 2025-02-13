import { ApplicationRef, DoBootstrap, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GantryCommonModule } from './common/gantry-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlerService } from './error-handler.service';
import { CommonInterceptor } from './common.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, GantryCommonModule],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true },
  ],
  //bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    appRef.bootstrap(AppComponent);
    // setTimeout(() => {
    //  appRef.bootstrap(AppComponent);
    // }, 2000);
    // Or some other component
  }
}
