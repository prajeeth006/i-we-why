import { Injectable } from '@angular/core';

import { DslService, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { first } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LoginConfig } from './login.client-config';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(
        private userService: UserService,
        private loginConfig: LoginConfig,
        private dslService: DslService,
    ) {}

    runAfterLogin(source: string, callback: () => void) {
        this.loginConfig.whenReady.pipe(first()).subscribe(() => {
            if (this.userService.isAuthenticated) {
                this.runCallback(source, callback);
            }

            this.userService.events
                .pipe(filter((event: UserEvent) => event instanceof UserLoginEvent))
                .subscribe(() => this.runCallback(source, callback));
        });
    }

    private runCallback(source: string, callback: () => void) {
        const featureName =
            Object.keys(this.loginConfig.disableFeatureDataPrefetch).find((name: string) => source.toLowerCase().includes(name.toLowerCase())) || '';

        const dsl = this.loginConfig.disableFeatureDataPrefetch[featureName];

        if (dsl) {
            this.dslService.evaluateExpression<boolean>(dsl).subscribe((disabled: boolean) => {
                if (!disabled) {
                    callback();
                }
            });
        } else {
            callback();
        }
    }
}
