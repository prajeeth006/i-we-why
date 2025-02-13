import { Injectable, inject } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class DateRange {
    start: Date;
    end: Date;
}

/**
 * @experimental
 */
@Injectable()
export class DatePickerService {
    private intlService = inject(IntlService);

    private readonly DELIMITER = '-';

    formatModel(model: Date | DateRange | null, dateFormat: string): string {
        if (!model) {
            return '';
        }

        const selectedDate = this.parseDate(model);

        if (selectedDate.end) {
            return this.convert(selectedDate.start, dateFormat) + ` ${this.DELIMITER} ` + this.convert(selectedDate.end, dateFormat);
        }

        return this.convert(selectedDate.start, dateFormat);
    }

    parseDate(date: Date | DateRange) {
        if (date instanceof Date) {
            return {
                start: NgbDate.from({
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                }),
                end: null,
            };
        } else {
            return {
                start: NgbDate.from({
                    day: date.start.getDate(),
                    month: date.start.getMonth() + 1,
                    year: date.start.getFullYear(),
                }),
                end: NgbDate.from({
                    day: date.end.getDate(),
                    month: date.end.getMonth() + 1,
                    year: date.end.getFullYear(),
                }),
            };
        }
    }

    private convert(date: NgbDate | null, dateFormat: string): string {
        if (!date) {
            return '';
        }

        const jsDate = new Date(date.year, date.month - 1, date.day);

        return this.intlService.formatDate(jsDate, dateFormat || 'MMM dd, yyyy');
    }
}
