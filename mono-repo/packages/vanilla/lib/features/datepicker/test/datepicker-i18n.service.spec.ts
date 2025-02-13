import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DatePickerI18nService } from '../src/datepicker-i18n.service';

describe('DatePickerService', () => {
    let service: DatePickerI18nService;

    registerLocaleData(localeDe, 'de');
    registerLocaleData(localePt, 'pt');
    registerLocaleData(localeIt, 'it');

    function init(locale: string) {
        TestBed.configureTestingModule({
            providers: [DatePickerI18nService, { provide: LOCALE_ID, useValue: locale }],
        });

        service = TestBed.inject(DatePickerI18nService);
    }

    it('getWeekdayShortName should return narrow weekday Name', () => {
        init('de');
        expect(service.getWeekdayShortName(2)).toBe('D'); //Dienstag
    });

    it('getMonthShortName should return', () => {
        init('pt');
        expect(service.getMonthShortName(8)).toBe('ago.');
    });

    it('getMonthFullName', () => {
        init('it');
        expect(service.getMonthFullName(4)).toBe('aprile');
    });
});
