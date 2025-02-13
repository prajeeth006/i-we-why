import { Pipe, PipeTransform } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: IntlService })
export class IntlServiceMock {
    @Stub() user: jasmine.Spy;
    @Stub() page: jasmine.Spy;
    @Stub() localeId: jasmine.Spy;
    @Stub() formatDate: jasmine.Spy;
    @Stub() formatCurrency: jasmine.Spy;
    @Stub() getCurrencySymbol: jasmine.Spy;
    @Stub() formatNumber: jasmine.Spy;

    getMonths() {
        return [
            { numeric: 1, shortName: 'Jan', longName: 'January' },
            { numeric: 2, shortName: 'Feb', longName: 'February' },
            { numeric: 3, shortName: 'Mar', longName: 'March' },
            { numeric: 4, shortName: 'Apr', longName: 'April' },
            { numeric: 5, shortName: 'May', longName: 'May' },
            { numeric: 6, shortName: 'Jun', longName: 'June' },
            { numeric: 7, shortName: 'Jul', longName: 'July' },
            { numeric: 8, shortName: 'Aug', longName: 'August' },
            { numeric: 9, shortName: 'Sep', longName: 'September' },
            { numeric: 10, shortName: 'Oct', longName: 'October' },
            { numeric: 11, shortName: 'Nov', longName: 'November' },
            { numeric: 12, shortName: 'Dec', longName: 'December' },
        ];
    }
}

@Pipe({ standalone: true, name: 'vnCurrency' })
export class FakeCurrencyPipe implements PipeTransform {
    transform(value: any) {
        return value;
    }
}

@Pipe({ standalone: true, name: 'vnCurrency' })
export class FakeCurrencyPipe2 implements PipeTransform {
    transform(value: any) {
        return value;
    }
}
