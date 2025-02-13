import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { NavigationService, RememberMeService, ToastrQueueService, ToastrSchedule, ToastrType } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { ConfirmPasswordResourceService } from './confirm-password-resource.service';
import { ConfirmPasswordConfig } from './confirm-password.client-config';

export const confirmPasswordGuard = async (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const confirmPasswordResourceService = inject(ConfirmPasswordResourceService);
    const rememberMeService = inject(RememberMeService);
    const config = inject(ConfirmPasswordConfig);
    const navigation = inject(NavigationService);
    const toastrQueueService = inject(ToastrQueueService);

    await firstValueFrom(config.whenReady);
    if (config.isEnabled && rememberMeService.tokenExists()) {
        try {
            const isPasswordValidationRequired = await confirmPasswordResourceService.isPasswordValidationRequired();
            if (isPasswordValidationRequired) {
                navigation.goTo(config.redirectUrl, { appendReferrer: state.url });
            }
            return !isPasswordValidationRequired;
        } catch (error) {
            navigation.goToLastKnownProduct();
            toastrQueueService.add(ToastrType.ConfirmPasswordError + (error && error.errorCode ? error.errorCode : ''), {
                schedule: ToastrSchedule.AfterNextNavigation,
            });
            return false;
        }
    }
    return true;
};
