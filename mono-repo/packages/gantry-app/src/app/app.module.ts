import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonInterceptor } from './common.interceptor';
import { GantryCommonModule } from './common/gantry-common.module';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, GantryCommonModule],
    providers: [
        { provide: ErrorHandler, useClass: ErrorHandlerService },
        { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AppModule {}
