import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HostConnectionComponent } from './host-connection/host-connection.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'
import { SharedModule } from './shared-module';
import { CookieService } from 'ngx-cookie-service';
import { ErrorInterceptor } from './error.interceptor';
import { DisplayManagerModule } from './display-manager/display-manager.module';
import { AppRoutingModule } from './app-routing.module';
import { ProgressService } from './common/progress-service/progress.service';

@NgModule({
    declarations: [
        AppComponent,
        HostConnectionComponent,
        PagenotfoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        DisplayManagerModule,
        AppRoutingModule
    ],
    bootstrap: [AppComponent],
    providers: [ProgressService, CookieService, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }