import { Injectable } from '@angular/core';

import {
    BalanceProperties,
    DSL_NOT_READY,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    IntlService,
} from '@frontend/vanilla/core';

import { BalancePropertiesService } from './balance-properties.service';

@Injectable()
export class BalancePropertiesDslValuesProvider implements DslValuesProvider {
    private balanceProperties: BalanceProperties | null;

    constructor(
        private readonly dslRecorderService: DslRecorderService,
        private readonly intlService: IntlService,
        readonly balancePropertiesService: BalancePropertiesService,
        readonly dslCacheService: DslCacheService,
    ) {
        balancePropertiesService.balanceProperties.subscribe((balanceProperties: BalanceProperties | null) => {
            this.balanceProperties = balanceProperties;
            dslCacheService.invalidate(['balance']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('balance');
        const createProperty = (name: string, getProperty: (b: BalanceProperties) => number) => {
            recordable.createProperty({
                name,
                get: () => (this.balanceProperties ? getProperty(this.balanceProperties) : DSL_NOT_READY),
                deps: ['balance'],
            });
        };

        createProperty('AccountBalance', (b) => b.accountBalance);
        createProperty('PayPalBalance', (b) => b.payPalBalance);
        createProperty('PayPalRestrictedBalance', (b) => b.payPalRestrictedBalance);
        createProperty('PayPalCashoutableBalance', (b) => b.payPalCashoutableBalance);
        createProperty('BalanceForGameType', (b) => b.balanceForGameType);
        createProperty('BonusWinningsRestrictedBalance', (b) => b.bonusWinningsRestrictedBalance);
        createProperty('CashoutRestrictedBalance', (b) => b.cashoutRestrictedBalance);
        createProperty('CashoutableBalance', (b) => b.cashoutableBalance);
        createProperty('CashoutableBalanceReal', (b) => b.cashoutableBalanceReal);
        createProperty('AvailableBalance', (b) => b.availableBalance);
        createProperty('DepositRestrictedBalance', (b) => b.depositRestrictedBalance);
        createProperty('InPlayAmount', (b) => b.inPlayAmount);
        createProperty('ReleaseRestrictedBalance', (b) => b.releaseRestrictedBalance);
        createProperty('PlayMoneyBalance', (b) => b.playMoneyBalance);
        createProperty('PlayMoneyInPlayAmount', (b) => b.playMoneyInPlayAmount);
        createProperty('OwedAmount', (b) => b.owedAmount);
        createProperty('TaxWithheldAmount', (b) => b.taxWithheldAmount);
        createProperty('PokerWinningsRestrictedBalance', (b) => b.pokerWinningsRestrictedBalance);
        createProperty('CashoutRestrictedCashBalance', (b) => b.cashoutRestrictedCashBalance);
        createProperty('CashoutableBalanceAtOnline', (b) => b.cashoutableBalanceAtOnline);
        createProperty('CashoutableBalanceAtRetail', (b) => b.cashoutableBalanceAtRetail);
        createProperty('CreditCardDepositBalance', (b) => b.creditCardDepositBalance);
        createProperty('CreditCardWinningsBalance', (b) => b.creditCardWinningsBalance);
        createProperty('DebitCardDepositBalance', (b) => b.debitCardDepositBalance);
        createProperty('MainRealBalance', (b) => b.mainRealBalance);
        createProperty('UncollectedFunds', (b) => b.uncollectedFunds);
        createProperty('SportsDepositBalance', (b) => b.sportsDepositBalance);
        createProperty('SportsExclusiveBalance', (b) => b.sportsExclusiveBalance);
        createProperty('GamesDepositBalance', (b) => b.gamesDepositBalance);
        createProperty('SportsWinningsBalance', (b) => b.sportsWinningsBalance);
        createProperty('PokerWinningsBalance', (b) => b.pokerWinningsBalance);
        createProperty('SlotsWinningsBalance', (b) => b.slotsWinningsBalance);
        createProperty('SportsRestrictedBalance', (b) => b.sportsRestrictedBalance);
        createProperty('PokerRestrictedBalance', (b) => b.pokerRestrictedBalance);
        createProperty('SlotsRestrictedBalance', (b) => b.slotsRestrictedBalance);
        createProperty('AllWinningsBalance', (b) => b.allWinningsBalance);
        createProperty('MaxLimitExceededBalance', (b) => b.maxLimitExceededBalance);
        createProperty('PrepaidCardDepositBalance', (b) => b.prepaidCardDepositBalance);

        recordable.createFunction({ name: 'IsLow', get: (balance: number) => this.balancePropertiesService.isLow(balance), deps: [] });
        recordable.createFunction({ name: 'Format', get: (balance: number) => this.intlService.formatCurrency(balance), deps: [] });

        return { Balance: recordable };
    }
}
