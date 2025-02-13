import { OverlayModule } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors, withJsonpSupport, withNoXsrfProtection } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ROUTER_CONFIGURATION, Router } from '@angular/router';

import { provideFastSVG } from '@push-based/ngx-fast-svg';
import { NgxFloatUiPlacements, NgxFloatUiTriggers, provideNgxFloatUiOptions } from 'ngx-float-ui';
import { ToastrModule } from 'ngx-toastr';

import { provideStyleLoading } from './assets-loading/style-loading.feature';
import { provideBootstrap } from './bootstrap/bootstrap.feature';
import { provideBrowser, provideBrowserInterceptors } from './browser/browser.feature';
import { WINDOW_OFFSET_PROVIDER } from './browser/window/window-offset-modifier.service';
import { provideTopLevelCookies } from './client-config/top-level-cookies.feature';
import { provideDsIntegration } from './ds-integration/ds-integration.feature';
import { provideDsl } from './dsl/dsl.feature';
import { provideDynamicLayout } from './dynamic-layout/dynamic-layout.feature';
import { provideError } from './error/error.feature';
import { HeaderWindowOffsetProvider } from './header/header-window-offset-provider';
import { provideHttpInterceptors } from './http/http.feature';
import { IconLoadStrategy } from './icons/icon-load-strategy';
import { provideLanguages } from './languages/languages.feature';
import { provideLastKnownProduct } from './last-known-product/last-known-product.feature';
import { LAUNCH_DARKLY_CONTEXT_PROVIDER } from './launch-darkly/launch-darkly-context-provider';
import { LaunchDarklyDefaultContextProvider } from './launch-darkly/launch-darkly-default-context-provider';
import { provideLogging } from './logging/logging.feature';
import { provideLogin, provideLoginInterceptors } from './login/login.feature';
import { provideMain } from './main/main.feature';
import { provideMessages, provideMessagesInterceptors } from './messages/messages.feature';
import { provideNavigation } from './navigation/navigation.feature';
import { providePlainLink } from './plain-link/plain-link.feature';
import { RouteProcessorService } from './routing/route-processor.service';
import { RoutingPageViewDataProvider } from './routing/routing-page-view-data-provider';
import { provideRouting } from './routing/routing.feature';
import { setupRouter } from './routing/vanilla-router';
import { ToastrComponent } from './toastr/toastr.component';
import { provideToastr } from './toastr/toastr.feature';
import { provideTracking } from './tracking/tracking-core.feature';
import { PAGE_VIEW_DATA_PROVIDER } from './tracking/tracking-core.models';

/**
 * @stable
 */
export function provideVanillaCore() {
    return provideTopLevelCookies()
        .concat(provideStyleLoading())
        .concat(provideLanguages())
        .concat(provideDsl())
        .concat(provideMain())
        .concat(provideLogin())
        .concat(provideRouting())
        .concat(providePlainLink())
        .concat(provideTracking())
        .concat(provideNavigation())
        .concat(provideMessages())
        .concat(provideLogging())
        .concat(provideToastr())
        .concat(provideLastKnownProduct())
        .concat(provideDsIntegration())
        .concat(provideBootstrap())
        .concat(provideBrowser())
        .concat(provideDynamicLayout())
        .concat(provideError())
        .concat(provideThirdPartyCoreIntegration());
}

function provideInterceptors() {
    return provideHttpInterceptors()
        .concat(provideLoginInterceptors())
        .concat(...provideMessagesInterceptors())
        .concat(...provideBrowserInterceptors());
}

function provideThirdPartyCoreIntegration() {
    return [
        provideHttpClient(withJsonpSupport(), withNoXsrfProtection(), withInterceptors(provideInterceptors())),
        provideNgxFloatUiOptions({ placement: NgxFloatUiPlacements.BOTTOM, trigger: NgxFloatUiTriggers.click }),
        importProvidersFrom(OverlayModule, ToastrModule.forRoot({ enableHtml: false, positionClass: 'toast-top', toastComponent: ToastrComponent })),
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { panelClass: 'vn-dialog-container', backdropClass: 'vn-backdrop' },
        },
        { provide: WINDOW_OFFSET_PROVIDER, useClass: HeaderWindowOffsetProvider, multi: true },
        { provide: LAUNCH_DARKLY_CONTEXT_PROVIDER, useClass: LaunchDarklyDefaultContextProvider, multi: true },
        { provide: PAGE_VIEW_DATA_PROVIDER, useClass: RoutingPageViewDataProvider, multi: true },
        {
            provide: Router,
            useFactory: setupRouter,
            // order is important, ROUTER_CONFIGURATION must be first
            deps: [ROUTER_CONFIGURATION, RouteProcessorService],
        },
        provideFastSVG({
            url: (name: string) => name,
            defaultSize: '31',
            svgLoadStrategy: IconLoadStrategy,
            suspenseSvgString: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176"><style>:root {--ds-fast-svg-placeholder-icon-fill: #00000009;}</style><path class="ds-fast-svg-placeholder-icon" style="fill: var(--ds-fast-svg-placeholder-icon-fill);" d="M0,88c0,48.6000061,39.4000015,88,88,88s88-39.3999939,88-88S136.6000061,0,88,0,0,39.4000015,0,88Z"/>`,
        }),
    ];
}
