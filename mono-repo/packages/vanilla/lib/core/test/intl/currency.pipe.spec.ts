import { TestBed } from '@angular/core/testing';

import { CurrencyPipe } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { IntlServiceMock } from './intl.mock';

describe('CurrencyPipe', () => {
    let currencyPipe: CurrencyPipe;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [CurrencyPipe, MockContext.providers],
        });

        currencyPipe = TestBed.inject(CurrencyPipe);
    });

    it('should format currency', () => {
        intlServiceMock.formatCurrency.withArgs(10, 'EUR', '1.0-0').and.returnValue('result');

        expect(currencyPipe.transform(10, 'EUR', '1.0-0')).toBe('result');
    });

    it('should return empty string for null', () => {
        expect(currencyPipe.transform(null, 'EUR', '1.0-0')).toBe('');
    });

    it('should return empty string for undefined', () => {
        expect(currencyPipe.transform(undefined, 'EUR', '1.0-0')).toBe('');
    });
});
