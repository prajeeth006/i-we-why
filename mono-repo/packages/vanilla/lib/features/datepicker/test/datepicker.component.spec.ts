import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerCalendarComponent, DatePickerComponent } from '@frontend/vanilla/features/datepicker';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { NgbDateRange } from '../src/datepicker.component';
import { DatePickerServiceMock } from './datepicker.service.mock';

describe('DatePickerComponent', () => {
    let fixture: ComponentFixture<DatePickerComponent>;
    let component: DatePickerComponent;
    let datePickerService: DatePickerServiceMock;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;
    let calendarComponentRef: any;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        datePickerService = MockContext.useMock(DatePickerServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(DeviceServiceMock);

        TestBed.overrideComponent(DatePickerCalendarComponent, {
            set: { imports: [], providers: [MockContext.providers], schemas: [NO_ERRORS_SCHEMA] },
        });
        TestBed.overrideComponent(DatePickerComponent, {
            set: { imports: [], providers: [MockContext.providers], schemas: [NO_ERRORS_SCHEMA] },
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
        calendarComponentRef = TestBed.createComponent(DatePickerCalendarComponent).componentRef;
        overlayRef.attach.and.returnValue(calendarComponentRef);

        fixture = TestBed.createComponent(DatePickerComponent);
        fixture.detectChanges();

        component = fixture.componentInstance;
    });

    it('should format Model and set formattedValue on date selected', () => {
        datePickerService.formatModel.and.returnValue('Jan 01, 2020');
        const date = new Date(2020, 1, 1);
        component.dateFormat = 'MMM dd, yyyy';
        component.onDateSelected(date);
        expect(datePickerService.formatModel).toHaveBeenCalledWith(date, 'MMM dd, yyyy');
        expect(component.formattedValue).toBe('Jan 01, 2020');
    });

    describe('writeValue', () => {
        it('should write model and formattedValue', () => {
            datePickerService.formatModel.and.returnValue('Jan 01, 2020');
            const ngbDateRange = { start: new NgbDate(2020, 1, 1) } as NgbDateRange;
            datePickerService.parseDate.and.returnValue(ngbDateRange);
            component.dateFormat = 'MMM dd, yyyy';

            const date = new Date(2020, 1, 1);
            component.writeValue(date);
            expect(datePickerService.formatModel).toHaveBeenCalledWith(date, 'MMM dd, yyyy');
            expect(component.formattedValue).toBe('Jan 01, 2020');
            expect(datePickerService.parseDate).toHaveBeenCalledWith(date);
            expect(component.model).toBe(ngbDateRange);
        });
    });

    describe('openDialog', () => {
        it('should open calendar component with global position', () => {
            component.rangeEnabled = true;
            component.dateFormat = 'MM dd yyyy';
            component.saveText = 'Continue';
            component.model = { start: new NgbDate(2020, 1, 1), end: new NgbDate(2020, 1, 30) };
            component.openDialog(); // act

            const expectedConfig = {
                panelClass: ['vn-datepicker'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<DatePickerCalendarComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(DatePickerCalendarComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);

            expect(calendarComponentRef.instance.rangeEnabled).toBeTrue();
            expect(calendarComponentRef.instance.dateFormat).toBe('MM dd yyyy');
            expect(calendarComponentRef.instance.saveText).toBe('Continue');
        });
    });
});
