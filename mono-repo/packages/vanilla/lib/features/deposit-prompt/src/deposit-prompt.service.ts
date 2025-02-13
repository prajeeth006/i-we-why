import { Injectable } from '@angular/core';

import {
    CookieName,
    CookieService,
    DateTimeService,
    DslService,
    TimerService,
    ToastrQueueOptions,
    ToastrQueueService,
    ToastrSchedule,
    ToastrType,
    UserService,
} from '@frontend/vanilla/core';
import { filter, first } from 'rxjs/operators';

import { DepositPromptConfig } from './deposit-prompt.client-config';

export class DepositPromptPostLoginOptions {
    willRedirect?: boolean;
}

/**
 * @stable
 */
@Injectable()
export class DepositPromptService {
    constructor(
        private depositPromptConfig: DepositPromptConfig,
        private cookieService: CookieService,
        private dslService: DslService,
        private toastrQueueService: ToastrQueueService,
        private user: UserService,
        private dateTimeService: DateTimeService,
        private timerService: TimerService,
    ) {}

    postLogin(options: DepositPromptPostLoginOptions): Promise<void> {
        this.cookieService.remove(CookieName.Dpto);

        switch (this.depositPromptConfig.trigger) {
            case 'Login':
                return this.afterLogin(options);
            case 'Always':
                this.timerService.setTimeoutOutsideAngularZone(() => this.startWatcher(), 5000);
                return this.afterLogin(options);
            case 'Off':
                return Promise.resolve();
        }
    }

    atStartup() {
        if (this.user.isAuthenticated && this.depositPromptConfig.trigger === 'Always') {
            this.startWatcher();
        }
    }

    private afterLogin(options: DepositPromptPostLoginOptions): Promise<void> {
        return new Promise((resolve) => {
            this.dslService
                .evaluateExpression(this.depositPromptConfig.condition)
                .pipe(first())
                .subscribe((show) => {
                    if (show) {
                        this.showToast({
                            schedule: options.willRedirect ? ToastrSchedule.AfterNextNavigation : ToastrSchedule.Immediate,
                            placeholders: { trigger: 'After Login' },
                        });
                    }
                });

            resolve();
        });
    }

    private showToast(options?: Partial<ToastrQueueOptions>) {
        // double check because of race conditions with afterLogin/startWatcher
        if (this.cookieService.get(CookieName.Dpto)) {
            return;
        }

        this.cookieService.put(CookieName.Dpto, '1', { expires: this.generateExpiryDate() });
        this.toastrQueueService.add(ToastrType.DepositPrompt, options);
    }

    private generateExpiryDate(): Date {
        const expireDate = this.dateTimeService.now();
        expireDate.setMilliseconds(expireDate.getMilliseconds() + this.depositPromptConfig.repeatTime);

        return expireDate;
    }

    private startWatcher() {
        this.dslService
            .evaluateExpression<boolean>(this.depositPromptConfig.condition)
            .pipe(filter((s) => s))
            .subscribe(() => {
                this.showToast({
                    placeholders: {
                        trigger: 'Periodic',
                    },
                });
            });
    }
}
