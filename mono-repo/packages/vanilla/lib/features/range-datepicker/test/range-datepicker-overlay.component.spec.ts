import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { MockContext } from 'moxxi';

import { RangeDatepickerOverlayComponent } from '../src/range-datepicker-overlay.component';
import { RangeDatepickerConfigMock, RangeDatepickerServiceMock } from './range-datepicker.mocks';

describe('RangeDatepickerOverlayComponent', () => {
    let fixture: ComponentFixture<RangeDatepickerOverlayComponent>;
    let component: RangeDatepickerOverlayComponent;
    let rangeDatepickerConfigMock: RangeDatepickerConfigMock;
    let rangeDatepickerServiceMock: RangeDatepickerServiceMock;

    beforeEach(() => {
        rangeDatepickerConfigMock = MockContext.useMock(RangeDatepickerConfigMock);
        rangeDatepickerServiceMock = MockContext.useMock(RangeDatepickerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        rangeDatepickerConfigMock.templates = {
            content: {
                form: {
                    startdateform: { id: 'startdateform' },
                    enddateform: { id: 'enddateform' },
                },
                children: {},
                links: {},
                validation: { validate: 'true' },
            },
        };
        rangeDatepickerConfigMock.firstDayOfWeek = 1;

        fixture = TestBed.createComponent(RangeDatepickerOverlayComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', {});
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should set configs', fakeAsync(() => {
            const configSpy = spyOn(component.config, 'set');
            const datepickerConfigSpy = spyOn(component.datepickerConfig, 'set');

            rangeDatepickerConfigMock.whenReady.next();
            tick();

            expect(configSpy).toHaveBeenCalledOnceWith(rangeDatepickerConfigMock);
            expect(datepickerConfigSpy).toHaveBeenCalledOnceWith(new NgbDatepickerConfig());
        }));

        it('should set day of week from config', fakeAsync(() => {
            rangeDatepickerConfigMock.firstDayOfWeek = 3;
            const config = new NgbDatepickerConfig();
            config.firstDayOfWeek = 3;
            const configSpy = spyOn(component.config, 'set');
            const datepickerConfigSpy = spyOn(component.datepickerConfig, 'set');

            rangeDatepickerConfigMock.whenReady.next();
            tick();

            expect(configSpy).toHaveBeenCalledOnceWith(rangeDatepickerConfigMock);
            expect(datepickerConfigSpy).toHaveBeenCalledOnceWith(config);
            rangeDatepickerConfigMock.firstDayOfWeek = 1;
        }));

        it('should not set day of week from config if options are passed as input', fakeAsync(() => {
            rangeDatepickerConfigMock.firstDayOfWeek = 2;
            const config = new NgbDatepickerConfig();
            config.firstDayOfWeek = 3;
            component.options = { datepickerConfig: config };

            const configSpy = spyOn(component.config, 'set');
            const datepickerConfigSpy = spyOn(component.datepickerConfig, 'set');

            rangeDatepickerConfigMock.whenReady.next();
            tick();

            expect(configSpy).toHaveBeenCalledOnceWith(rangeDatepickerConfigMock);
            expect(datepickerConfigSpy).toHaveBeenCalledOnceWith(config);
            rangeDatepickerConfigMock.firstDayOfWeek = 1;
        }));
    });

    describe('setDateRange', () => {
        it('should update date range', () => {
            const selectedRangeSpy = spyOn(component.selectedRange, 'set');

            component.setDateRange('1');

            expect(component.dateRange).toEqual({
                start: new Date(),
                end: new Date(new Date().setDate(new Date().getDate() + 1)),
            });
            expect(selectedRangeSpy).toHaveBeenCalledOnceWith('1');
        });
    });

    describe('setStartDate', () => {
        it('should set start date', () => {
            const date = new Date();
            component.setStartDate(date);

            expect(component.dateRange).toEqual({ ...component.dateRange, start: date });
        });
    });

    describe('setEndDate', () => {
        it('should set end date', () => {
            const date = new Date();
            component.setEndDate(date);

            expect(component.dateRange).toEqual({ ...component.dateRange, end: date });
        });
    });

    describe('onApply', () => {
        it('should emmit date range', () => {
            const applySpy = spyOn(component.apply, 'emit');

            component.onApply();

            expect(applySpy).toHaveBeenCalledOnceWith(component.dateRange);
            expect(rangeDatepickerServiceMock.apply).toHaveBeenCalledOnceWith(component.dateRange);
        });
    });

    describe('onClear', () => {
        it('should clear date range', () => {
            const clearSpy = spyOn(component.clear, 'emit');
            const selectedRangeSpy = spyOn(component.selectedRange, 'set');
            component.dateRange = { start: new Date(), end: new Date() };

            component.onClear();

            expect(component.dateRange).toEqual({ start: null, end: null });
            expect(clearSpy).toHaveBeenCalledOnceWith();
            expect(selectedRangeSpy).toHaveBeenCalledOnceWith('');
        });
    });

    describe('onClose', () => {
        it('should detach the overlay', () => {
            const closeSpy = spyOn(component.close, 'emit');

            component.onClose();

            expect(closeSpy).toHaveBeenCalledOnceWith();
            expect(rangeDatepickerServiceMock.close).toHaveBeenCalledOnceWith();
        });
    });
});
