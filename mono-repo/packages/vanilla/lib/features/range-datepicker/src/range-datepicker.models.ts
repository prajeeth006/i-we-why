import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * @stable
 */
export interface RangeDatepickerOptions {
    dateRange?: DateRange;
    disableApply?: boolean;
    disableClear?: boolean;
    datepickerConfig?: NgbDatepickerConfig;
}

export interface DateRange {
    start: Date | null;
    end: Date | null;
}
