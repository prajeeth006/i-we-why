import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { IntlService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PageMock } from '../browsercommon/page.mock';

describe('IntlService', () => {
    let service: IntlService;
    let pageMock: PageMock;
    let userMock: UserServiceMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        userMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [IntlService, MockContext.providers, CurrencyPipe, DecimalPipe],
        });

        service = TestBed.inject(IntlService);

        userMock.currency = 'USD';
        pageMock.currency = {
            default: 'symbol',
            eur: 'code',
            bam: 'bwin',
        };
    });

    describe('formatCurrency', () => {
        it('should format currency with user balance and configured display', () => {
            expect(service.formatCurrency(10)).toBe('$10.00');

            userMock.currency = 'EUR';

            expect(service.formatCurrency(10)).toBe('EUR10.00');
        });

        it('should allow bwin format', () => {
            userMock.currency = 'BAM';

            expect(service.formatCurrency(10)).toBe('10.00 BAM');
        });

        it('should allow to override currency', () => {
            expect(service.formatCurrency(10, 'EUR')).toBe('EUR10.00');
        });

        it('should allow to override digit info', () => {
            expect(service.formatCurrency(10, undefined, '1.0-2')).toBe('$10');
        });
    });

    describe('formatDate', () => {
        it('should format date', () => {
            expect(service.formatDate('2018-06-05T03:02:00Z', 'short', '+0300')).toBe('6/5/18, 6:02 AM');
        });
        it('should format date with short if not format specified', () => {
            expect(service.formatDate('2018-06-05T03:02:00Z', undefined, '+0300')).toBe('6/5/18, 6:02 AM');
        });
    });

    describe('getCurrencySymbol', () => {
        it('should get default symbol', () => {
            expect(service.getCurrencySymbol()).toBe('$');
        });
        it('should get symbol for specified currency code', () => {
            expect(service.getCurrencySymbol('BRL')).toBe('R$');
        });
    });

    describe('getMonths()', () => {
        it('should return month names', () => {
            pageMock.culture = 'de';

            const months = service.getMonths();
            const expected = [
                { numeric: 1, longName: 'Januar', shortName: 'Jan' },
                { numeric: 2, longName: 'Februar', shortName: 'Feb' },
                { numeric: 3, longName: 'März', shortName: 'Mär' },
                { numeric: 4, longName: 'April', shortName: 'Apr' },
                { numeric: 5, longName: 'Mai', shortName: 'Mai' },
                { numeric: 6, longName: 'Juni', shortName: 'Jun' },
                { numeric: 7, longName: 'Juli', shortName: 'Jul' },
                { numeric: 8, longName: 'August', shortName: 'Aug' },
                { numeric: 9, longName: 'September', shortName: 'Sep' },
                { numeric: 10, longName: 'Oktober', shortName: 'Okt' },
                { numeric: 11, longName: 'November', shortName: 'Nov' },
                { numeric: 12, longName: 'Dezember', shortName: 'Dez' },
            ];
            expect(months).toEqual(expected);
        });
    });
});
