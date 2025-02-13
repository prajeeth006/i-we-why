import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { camelCase } from 'lodash-es';
import { MockContext } from 'moxxi';

import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { BalancePropertiesDslValuesProvider } from '../src/balance-properties-dsl-values-provider';
import { BalancePropertiesServiceMock } from './balance-properties.service.mock';

const balanceProperties = [
    'AccountBalance',
    'PayPalBalance',
    'PayPalRestrictedBalance',
    'PayPalCashoutableBalance',
    'BalanceForGameType',
    'BonusWinningsRestrictedBalance',
    'CashoutRestrictedBalance',
    'CashoutableBalance',
    'CashoutableBalanceReal',
    'AvailableBalance',
    'DepositRestrictedBalance',
    'InPlayAmount',
    'ReleaseRestrictedBalance',
    'PlayMoneyBalance',
    'PlayMoneyInPlayAmount',
    'OwedAmount',
    'TaxWithheldAmount',
    'PokerWinningsRestrictedBalance',
    'CashoutRestrictedCashBalance',
    'CashoutableBalanceAtOnline',
    'CashoutableBalanceAtRetail',
    'CreditCardDepositBalance',
    'CreditCardWinningsBalance',
    'DebitCardDepositBalance',
    'MainRealBalance',
    'UncollectedFunds',
    'SportsExclusiveBalance',
    'SportsDepositBalance',
    'GamesDepositBalance',
    'SportsWinningsBalance',
    'PokerWinningsBalance',
    'SlotsWinningsBalance',
    'SportsRestrictedBalance',
    'PokerRestrictedBalance',
    'SlotsRestrictedBalance',
    'AllWinningsBalance',
    'MaxLimitExceededBalance',
    'PrepaidCardDepositBalance',
];

describe('BalancePropertiesDslValuesProvider', () => {
    let target: DslRecordable;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, BalancePropertiesDslValuesProvider],
        });

        const provider = TestBed.inject(BalancePropertiesDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['Balance']!;
    });

    for (const property of balanceProperties) {
        describe(property, () => {
            it('should return appropriate value', () => {
                balancePropertiesServiceMock.balanceProperties.next(<any>{ [camelCase(property)]: 66 });
                expect(target[property]).toBe(66);
            });

            it('should return DSL_NOT_READY if balance properties are not loaded', () => {
                expect(() => target[property]).toThrowError(DSL_NOT_READY);
            });
        });
    }

    describe('IsLow', () => {
        it('should return value from service', () => {
            balancePropertiesServiceMock.isLow.withArgs(11).and.returnValue(true);
            balancePropertiesServiceMock.isLow.withArgs(12).and.returnValue(false);

            expect(target['IsLow'](11)).toBeTrue();
            expect(target['IsLow'](12)).toBeFalse();
        });
    });

    describe('Format', () => {
        it('should return formatted value from intl service', () => {
            intlServiceMock.formatCurrency.withArgs(11).and.returnValue('11 EUR');

            expect(target['Format'](11)).toBe('11 EUR');
        });
    });
});
