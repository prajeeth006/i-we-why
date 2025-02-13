import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { LOGIN_RESPONSE_HANDLER_HOOK, runOnFeatureInit, runOnLoginNavigation } from '@frontend/vanilla/core';

import { LoginIntegrationNavigationProvider } from './integration/login-integration-navigation-provider.service';
import { LoginBootstrapService } from './login-bootstrap.service';
import { LoginDialogService } from './login-dialog.service';
import { LimitsToastrLoginResponseHandlerHook } from './login-response-handler/limits-toastr-login-response-handler-hook';
import { NativeAppLoginResponseHandlerHook } from './login-response-handler/native-app-login-response-handler-hook';
import { TrackingLoginResponseHandlerHook } from './login-response-handler/tracking-login-response-handler-hook';

export function provide() {
    return [
        LoginDialogService,
        importProvidersFrom(MatDialogModule),
        runOnFeatureInit(LoginBootstrapService),
        runOnLoginNavigation(LoginIntegrationNavigationProvider),
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: TrackingLoginResponseHandlerHook, multi: true },
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: NativeAppLoginResponseHandlerHook, multi: true },
        { provide: LOGIN_RESPONSE_HANDLER_HOOK, useClass: LimitsToastrLoginResponseHandlerHook, multi: true },
    ];
}
