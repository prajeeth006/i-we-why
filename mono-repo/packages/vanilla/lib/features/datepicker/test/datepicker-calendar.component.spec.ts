import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DatePickerCalendarComponent } from '@frontend/vanilla/features/datepicker';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';

describe('DatePickerCalendarComponent', () => {
    let fixture: ComponentFixture<DatePickerCalendarComponent>;
    let component: DatePickerCalendarComponent;

    beforeEach(() => {
        MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            imports: [NgbDatepickerModule, FormsModule],
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(DatePickerCalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('onDateChange', () => {
        it('should emit date change event', () => {
            const onDateChangeSpy = spyOn(component.onDateChangeEvent, 'emit');
            const date = new NgbDate(2020, 1, 1);
            const result = new Date(2020, 0, 1, 12, 0, 0, 0);

            component.onDateChange(date);

            expect(component.model).toEqual(result);
            expect(onDateChangeSpy).toHaveBeenCalledOnceWith(result);
        });

        it('should close if header is disabled', () => {
            component.headerEnabled = false;
            const closeSpy = spyOn(component, 'close');

            component.onDateChange(new NgbDate(2020, 1, 1));

            expect(closeSpy).toHaveBeenCalled();
        });

        it('should save if footer is disabled', () => {
            component.footerEnabled = false;
            const saveSpy = spyOn(component, 'save');

            component.onDateChange(new NgbDate(2020, 1, 1));

            expect(saveSpy).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        it('should emit date selected event on save with range enabled', () => {
            component.startDate = new NgbDate(2020, 1, 1);

            const onSelectSpy = spyOn(component.onDateSelectedEvent, 'emit');
            component.rangeEnabled = true;
            component.onDateChange(new NgbDate(2020, 1, 31));

            expect(onSelectSpy).not.toHaveBeenCalled();

            component.save();

            expect(onSelectSpy).toHaveBeenCalledOnceWith({ start: new Date(2020, 0, 1, 12, 0, 0, 0), end: new Date(2020, 0, 31, 12, 0, 0, 0) });
        });

        it('should emit date selected event on save with range disabled', () => {
            const onSelectSpy = spyOn(component.onDateSelectedEvent, 'emit');
            component.rangeEnabled = false;
            component.onDateChange(new NgbDate(2020, 1, 1));

            expect(onSelectSpy).not.toHaveBeenCalled();

            component.save();

            expect(onSelectSpy).toHaveBeenCalledOnceWith(new Date(2020, 0, 1, 12, 0, 0, 0));
        });
    });

    describe('close', () => {
        it('should emit event on close', () => {
            const onCloseSpy = spyOn(component.onCloseEvent, 'emit');

            component.close();

            expect(onCloseSpy).toHaveBeenCalled();
        });
    });

    describe('isSelectingRange', () => {
        it('should check if range is being selected after selecting start date', () => {
            component.startDate = new NgbDate(2020, 1, 1);
            component.hoveredDate = new NgbDate(2020, 1, 10);

            expect(component.isSelectingRange(new NgbDate(2020, 1, 1))).toBeFalse();
            expect(component.isSelectingRange(new NgbDate(2020, 1, 2))).toBeTrue();
            expect(component.isSelectingRange(new NgbDate(2020, 1, 10))).toBeFalse();
        });
    });

    describe('isInsideRange', () => {
        it('should check if date is inside range', () => {
            component.startDate = new NgbDate(2020, 1, 1);
            component.endDate = new NgbDate(2020, 1, 31);

            expect(component.isInsideRange(new NgbDate(2020, 1, 1))).toBeFalse();
            expect(component.isInsideRange(new NgbDate(2020, 1, 31))).toBeFalse();
            expect(component.isInsideRange(new NgbDate(2020, 2, 3))).toBeFalse();
            expect(component.isInsideRange(new NgbDate(2020, 1, 10))).toBeTrue();
        });
    });
});
