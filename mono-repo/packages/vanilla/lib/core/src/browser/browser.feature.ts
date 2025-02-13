import { AnimationDriver as AngularAnimationDriver } from '@angular/animations/browser';
import { HttpInterceptorFn } from '@angular/common/http';
import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { PAGE_VIEW_DATA_PROVIDER } from '../tracking/tracking-core.models';
import { AnimationDriver } from './animation-driver';
import { appContextInterceptor } from './app-context.interceptor';
import { browserUrlInterceptor } from './browser-url.interceptor';
import { CookieBootstrapService } from './cookie/cookie-bootstrap.service';
import { CookieOptionsProvider } from './cookie/cookie-options-provider';
import { deviceTypeInterceptor } from './device-type.interceptor';
import { DeviceBootstrapService } from './device/device-bootstrap.service';
import { headerProductInterceptor } from './header-product.interceptor';
import { nativeAppInterceptor } from './native-app.interceptor';
import { networkStatusInterceptor } from './network-status.interceptor';
import { offlinePageInterceptor } from './offline-page.interceptor';
import { BrowserPerformanceBootstrapService } from './performance/browser-performance-bootstrap.service';
import { LoadPerformancePageViewDataProvider } from './performance/load-performance-page-view-data-provider';
import { NavigationPerformancePageViewDataProvider } from './performance/navigation-performance-page-view-data-provider';
import { WindowEventsBootstrapService } from './window/window-events-bootstrap.service';

export function provideBrowser(): Provider[] {
    return [
        { provide: CookieOptionsProvider, useClass: CookieOptionsProvider },
        { provide: AngularAnimationDriver, useClass: AnimationDriver },
        { provide: PAGE_VIEW_DATA_PROVIDER, useClass: LoadPerformancePageViewDataProvider, multi: true },
        { provide: PAGE_VIEW_DATA_PROVIDER, useClass: NavigationPerformancePageViewDataProvider, multi: true },
        runOnAppInit(CookieBootstrapService),
        runOnAppInit(DeviceBootstrapService),
        runOnAppInit(WindowEventsBootstrapService),
        runOnAppInit(BrowserPerformanceBootstrapService),
    ];
}

export function provideBrowserInterceptors(): HttpInterceptorFn[] {
    return [
        browserUrlInterceptor,
        appContextInterceptor,
        deviceTypeInterceptor,
        nativeAppInterceptor,
        headerProductInterceptor,
        networkStatusInterceptor,
        offlinePageInterceptor,
    ];
}
