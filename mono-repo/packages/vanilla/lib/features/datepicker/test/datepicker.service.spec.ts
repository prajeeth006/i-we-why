import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { DatePickerService } from '../../../features/datepicker/src/datepicker.service';

describe('DatePickerService', () => {
    let service: DatePickerService;
    let intlServiceMock: IntlServiceMock;

    beforeEach(() => {
        intlServiceMock = MockContext.useMock(IntlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DatePickerService],
        });

        service = TestBed.inject(DatePickerService);

        intlServiceMock.formatDate.withArgs(new Date(2020, 1, 1), 'MMM dd, yyyy').and.returnValue('Jan 01, 2020');
        intlServiceMock.formatDate.withArgs(new Date(2020, 1, 31), 'MMM dd, yyyy').and.returnValue('Jan 31, 2020');
    });

    describe('formatModel()', () => {
        it('should return formatted date', () => {
            const model = service.formatModel(new Date(2020, 1, 1), '');

            expect(model).toBe('Jan 01, 2020');
        });

        it('should return formatted range', () => {
            const model = service.formatModel({ start: new Date(2020, 1, 1), end: new Date(2020, 1, 31) }, '');

            expect(model).toBe('Jan 01, 2020 - Jan 31, 2020');
        });
    });
});
