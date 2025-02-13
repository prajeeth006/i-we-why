import { inject } from '@angular/core';

import { NativeAppConfig, NativeAppService, NativeEventType } from '@frontend/vanilla/core';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { WrapperSettingsService } from '@frontend/vanilla/shared/native-app';
import { firstValueFrom } from 'rxjs';

import { LoginIntegrationService } from './integration/login-integration.service';
import { LoginContent } from './login-content.client-config';
import { LoginContentService } from './login-content.service';

export const loginStandaloneGuard = async () => {
    const loginIntegrationService = inject(LoginIntegrationService);
    const loginConfig = inject(LoginConfig);
    const loginContent = inject(LoginContent);
    const wrapperSettingsService = inject(WrapperSettingsService);
    const loginContentService = inject(LoginContentService);
    const nativeAppConfig = inject(NativeAppConfig);
    const nativeAppService = inject(NativeAppService);

    if (nativeAppConfig.sendOpenLoginDialogEvent) {
        nativeAppService.sendToNative({ eventName: NativeEventType.OPENLOGINDIALOG });
        return false;
    } else {
        await Promise.all([
            firstValueFrom(loginConfig.whenReady),
            firstValueFrom(loginContent.whenReady),
            loginIntegrationService.init(),
            firstValueFrom(wrapperSettingsService.applicationSettingsFired),
            firstValueFrom(loginContentService.initialized),
        ]);

        if (loginIntegrationService.redirectEnabled) {
            loginIntegrationService.redirectToLogin();
            return false;
        }
    }
    return true;
};
