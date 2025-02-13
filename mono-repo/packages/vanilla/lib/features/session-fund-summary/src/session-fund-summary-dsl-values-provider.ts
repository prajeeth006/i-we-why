import { Injectable } from '@angular/core';

import {
    BalanceProperties,
    DSL_NOT_READY,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    UserService,
} from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { SessionFundSummary, SessionFundSummaryService } from '@frontend/vanilla/shared/session-fund-summary';
import { filter } from 'rxjs/operators';

@Injectable()
export class SessionFundSummaryDslValuesProvider implements DslValuesProvider {
    private static AnonymousValue = -1;
    private summary: SessionFundSummary | null;
    private isLoaded: boolean = false;

    constructor(
        readonly dslCacheService: DslCacheService,
        private readonly dslRecorderService: DslRecorderService,
        private readonly userService: UserService,
        private readonly balancePropertiesService: BalancePropertiesService,
        private readonly sessionFundSummaryService: SessionFundSummaryService,
    ) {
        this.sessionFundSummaryService.getSummary.subscribe((summary: SessionFundSummary | null) => {
            this.summary = summary;
            dslCacheService.invalidate(['sessionFundSummary']);
        });

        this.balancePropertiesService.balanceProperties
            .pipe(
                filter(Boolean),
                filter((b: BalanceProperties) => b.propagateRefresh),
            )
            .subscribe(() => this.sessionFundSummaryService.refresh());
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('sessionFundSummary');
        const createProperty = (name: string, getProperty: (s: SessionFundSummary) => number) => {
            recordable.createProperty({
                name,
                get: () => this.getCurrentValue(() => (this.summary ? getProperty(this.summary) : DSL_NOT_READY)),
                deps: ['sessionFundSummary', 'user.isAuthenticated'],
            });
        };

        createProperty('Loss', (s: SessionFundSummary) => s.loss);
        createProperty('Profit', (s: SessionFundSummary) => s.profit);
        createProperty('TotalStake', (s: SessionFundSummary) => s.totalStake);
        createProperty('InitialBalance', (s: SessionFundSummary) => s.initialBalance);
        createProperty('CurrentBalance', (s: SessionFundSummary) => s.currentBalance);

        return { SessionFundSummary: recordable };
    }

    private getCurrentValue(get: () => string): string | number {
        if (!this.userService.isAuthenticated) {
            return SessionFundSummaryDslValuesProvider.AnonymousValue;
        }

        if (!this.isLoaded) {
            this.sessionFundSummaryService.refresh();
            this.isLoaded = true;
        }

        return get();
    }
}
