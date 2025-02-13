import { Injectable } from '@angular/core';

import {
    DSL_NOT_READY,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    IntlService,
    UserService,
} from '@frontend/vanilla/core';
import { UserSummary, UserSummaryService } from '@frontend/vanilla/shared/user-summary';

@Injectable()
export class UserSummaryDslValuesProvider implements DslValuesProvider {
    private static AnonymousValue = -1;
    private summary: UserSummary | null;
    private isLoaded: boolean = false;

    constructor(
        readonly dslCacheService: DslCacheService,
        private readonly dslRecorderService: DslRecorderService,
        private readonly intlService: IntlService,
        private readonly userService: UserService,
        private readonly userSummaryService: UserSummaryService,
    ) {
        this.userSummaryService.getSummary().subscribe((summary: UserSummary | null) => {
            this.summary = summary;
            dslCacheService.invalidate(['userSummary']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('userSummary');
        const createProperty = (name: string, getProperty: (s: UserSummary) => number) => {
            recordable.createProperty({
                name,
                get: () => this.getCurrentValue(() => (this.summary ? getProperty(this.summary) : DSL_NOT_READY)),
                deps: ['userSummary', 'user.isAuthenticated'],
            });
        };

        createProperty('Loss', (s) => s.loss);
        createProperty('Profit', (s) => s.profit);
        createProperty('NetLoss', (s) => s.netLoss);
        createProperty('NetProfit', (s) => s.netProfit);
        createProperty('PokerTaxCollected', (s) => s.pokerTaxCollected);
        createProperty('CasinoTaxCollected', (s) => s.casinoTaxCollected);
        createProperty('SportsTaxCollected', (s) => s.sportsTaxCollected);
        createProperty('TotalDepositAmount', (s) => s.totalDepositamount);
        createProperty('TotalWithdrawalAmount', (s) => s.totalWithdrawalamount);

        recordable.createFunction({
            name: 'Format',
            get: (value: number) => this.intlService.formatCurrency(value),
            deps: [],
        });

        return { UserSummary: recordable };
    }

    private getCurrentValue(get: () => string) {
        if (!this.userService.isAuthenticated) {
            return UserSummaryDslValuesProvider.AnonymousValue;
        }

        if (!this.isLoaded) {
            this.userSummaryService.refresh();
            this.isLoaded = true;
        }

        return get();
    }
}
