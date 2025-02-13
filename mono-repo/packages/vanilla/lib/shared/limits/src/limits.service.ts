import { Injectable } from '@angular/core';

import { CommonMessages, IntlService, UserService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { DepositLimit, DepositLimitsResonse, DepositLimitsService } from './deposit-limits.service';
import { PlayerLimit, PlayerLimitsService } from './player-limits.service';

@Injectable({
    providedIn: 'root',
})
export class LimitsService {
    constructor(
        private depositLimitsService: DepositLimitsService,
        private commonMessages: CommonMessages,
        private playerLimitsService: PlayerLimitsService,
        private userService: UserService,
        private intlService: IntlService,
    ) {}

    async getToasterPlaceholders(): Promise<{ [key: string]: string }> {
        const depositLimitsResponse: DepositLimitsResonse = await firstValueFrom(this.depositLimitsService.get());
        const depositLimits = depositLimitsResponse.limits
            .filter((limit: DepositLimit) => limit.limitSet && ['MONTHLY', 'WEEKLY', 'DAILY'].includes(limit.type))
            .map((depositLimit) => {
                return `${this.commonMessages[`DepositLimitType:${depositLimit.type}`]} ${this.intlService.formatCurrency(
                    depositLimit.currentLimit || 0,
                )}`;
            })
            .join(', ');

        const playerLimitsResponse = await firstValueFrom(this.playerLimitsService.get());
        const sessionLimits = playerLimitsResponse.limits
            .filter((l: PlayerLimit) =>
                ['LOGIN_TIME_PER_MONTH_IN_MINUTES', 'LOGIN_TIME_PER_WEEK_IN_MINUTES', 'LOGIN_TIME_PER_DAY_IN_MINUTES'].includes(l.limitType),
            )
            .map(
                (sessionLimit) =>
                    `${this.commonMessages[`PlayerLimitType:${sessionLimit.limitType}`]} ${
                        Math.round(((sessionLimit.currentLimit || 0) / 60) * 100) / 100
                    } ${this.commonMessages['Hours']}`,
            )
            .join(', ');

        const creditLimit = playerLimitsResponse.limits.find((l: PlayerLimit) => l.limitType === 'AUTOPAYOUT_LIMIT_ON_WINNING');

        return {
            displayName: this.userService.displayName,
            lastLoginTime: this.userService.lastLoginTimeFormatted || this.commonMessages['NotAvailable']!,
            depositLimits: depositLimits || this.commonMessages['NotAvailable']!,
            sessionLimits: sessionLimits,
            creditLimit: creditLimit ? this.intlService.formatCurrency(creditLimit.currentLimit) : this.commonMessages['NotAvailable']!,
        };
    }
}
