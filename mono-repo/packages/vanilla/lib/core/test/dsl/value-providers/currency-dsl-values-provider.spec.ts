import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CurrencyDslValuesProvider } from '../../../src/dsl/value-providers/currency-dsl-values-provider';
import { IntlServiceMock } from '../../intl/intl.mock';
import { UserServiceMock } from '../../user/user.mock';

describe('CurrencyDslValuesProvider', () => {
    let target: DslRecordable;
    let userMock: UserServiceMock;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, CurrencyDslValuesProvider],
        });

        const provider = TestBed.inject(CurrencyDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['Currency']!;
        userMock.currency = 'USD';

        intlServiceMock.formatCurrency.withArgs(10).and.returnValue('$10');
        intlServiceMock.formatCurrency.withArgs(0).and.returnValue('$0');
    });

    describe('Symbol', () => {
        it('should return symbol from intl service', () => {
            intlServiceMock.getCurrencySymbol.and.returnValue('$');

            expect(target['Symbol']).toBe('$');
        });
    });

    describe('Format', () => {
        it('should return formatted value', () => {
            expect(target['Format']('10')).toBe('$10');
        });

        it('should return formatted value if zero', () => {
            expect(target['Format']('0')).toBe('$0');
        });

        it('should return formatted value based on user currency when list of currencyCodes passed along with values', () => {
            expect(target['Format']('USD|10,EUR|20,GBP|30')).toBe('$10');
        });

        it('should throw when user currency not in the list', () => {
            expect(() => target['Format']('EUR|20,GBP|30')).toThrow();
        });
    });
});
