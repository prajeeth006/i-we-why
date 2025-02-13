import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DateComponent, DateConfig, FormFieldComponent } from '@frontend/vanilla/shared/forms';
import { Mock, MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { IntlServiceMock } from '../../../../core/test/intl/intl.mock';
import { ValidationHelperServiceMock } from '../../../../shared/forms/test/forms/validation-helper.mock';

@Mock({ of: DateConfig })
export class DateConfigMock extends DateConfig {
    override whenReady = new Subject<void>();
}

@Component({
    template: `
        <form #formRef="ngForm">
            <vn-date #dateref name="date-ctrl" [(ngModel)]="date" [disabled]="isDisabled" />
        </form>
    `,
})
class TestComponent {
    @Input() date: Date;
    @Input() isDisabled: boolean = false;
    @Input() isLoginScreen: boolean = false;
}

describe('DateComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let debugElem: DebugElement;
    let dateConfigMock: DateConfigMock;
    let commonMessagesMock: CommonMessagesMock;

    beforeEach(() => {
        dateConfigMock = MockContext.useMock(DateConfigMock);
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(IntlServiceMock);
        MockContext.useMock(ValidationHelperServiceMock);

        TestBed.configureTestingModule({
            imports: [FormsModule, DateComponent, FormFieldComponent],
            declarations: [TestComponent],
            providers: [...MockContext.providers],
        });

        commonMessagesMock.DateDayPlaceholder = 'DD';
        commonMessagesMock.DateMonthPlaceholder = 'MM';
        commonMessagesMock.DateYearPlaceholder = 'YYYY';
    });

    it('should handle empty string input', () => {
        const fx = TestBed.createComponent(DateComponent);
        fx.componentInstance.writeValue('');
        expect(fx.componentInstance.model).toEqual({ day: null, month: null, year: null });
    });

    it('should set the days', () => {
        const fx = TestBed.createComponent(DateComponent);
        fx.componentInstance.writeValue('');
        fx.detectChanges();

        if (fx.componentInstance.model.month == 2) {
            expect(fx.componentInstance.days.length).toBeLessThanOrEqual(29);
        } else {
            expect(fx.componentInstance.days.length).toBeLessThanOrEqual(31);
        }
    });

    it('should emit events on day, month and year changed', () => {
        const fx = TestBed.createComponent(DateComponent);
        const component = fx.componentInstance;
        spyOn(component.onDayChanged, 'emit');
        spyOn(component.onMonthChanged, 'emit');
        spyOn(component.onYearChanged, 'emit');

        component.onDayChange(new Event('blur'));
        component.onMonthChange(new Event('blur'));
        component.onYearChange(new Event('blur'));

        expect(component.onDayChanged.emit).toHaveBeenCalled();
        expect(component.onMonthChanged.emit).toHaveBeenCalled();
        expect(component.onYearChanged.emit).toHaveBeenCalled();
    });

    it('should trigger onTouched when all inputs are touched', () => {
        const fx = TestBed.createComponent(DateComponent);
        const component = fx.componentInstance;
        fx.detectChanges();
        spyOn(component, 'onTouched');

        component.onDayChange({ target: new EventTarget() } as Event);
        component.onMonthChange({ target: new EventTarget() } as Event);

        expect(component.onTouched).not.toHaveBeenCalled();

        component.onYearChange({ target: new EventTarget() } as Event);

        expect(component.onTouched).toHaveBeenCalled();
    });

    describe('with showMonthFirst = false', () => {
        beforeEach(() => {
            dateConfigMock.showMonthFirst = false;
            createComponent();
        });

        describe('and new layout', () => {
            beforeEach(() => {
                dateConfigMock.whenReady.next();
            });

            runCommonTests();

            it('should add labels in order day-month-year]', waitForAsync(() => {
                fixture.whenStable().then(() => {
                    const labels = debugElem.queryAll(By.css('label')).map((e) => e.nativeElement.innerText);

                    expect(labels[0]).toBe('DD');
                    expect(labels[1]).toBe('MM');
                    expect(labels[2]).toBe('YYYY');
                });
            }));
        });
    });

    describe('with showMonthFirst = true', () => {
        beforeEach(() => {
            dateConfigMock.showMonthFirst = true;
            createComponent();
        });

        describe('and new layout', () => {
            beforeEach(() => {
                dateConfigMock.whenReady.next();
            });

            runCommonTests();

            it('should add labels in order month-day-year]', waitForAsync(() => {
                fixture.whenStable().then(() => {
                    const labels = debugElem.queryAll(By.css('label')).map((e) => e.nativeElement.innerText);

                    expect(labels[0]).toBe('MM');
                    expect(labels[1]).toBe('DD');
                    expect(labels[2]).toBe('YYYY');
                });
            }));
        });
    });

    function runCommonTests() {
        it('should setup form elements in view', waitForAsync(assertThatFormElementsAreSetupInView));
        it('should disable form elements in view', waitForAsync(assertThatFormElementsAreDisabledInView));
        it('should fail to validate when model is not a date time', waitForAsync(assertThatInputHasIsDateTimeError));
        it('should fail to validate when model is invalid date time', waitForAsync(assertThatInputHasIsDateTimeErrorForInvalidDates));
        it('should update model when input changes', waitForAsync(assertThatViewValueChangeTriggersModelChange));
    }

    function createComponent() {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        debugElem = fixture.debugElement;
        fixture.autoDetectChanges(true);
    }

    function getView(): { day: HTMLInputElement; month: HTMLSelectElement; year: HTMLInputElement } {
        const day = debugElem.query(By.css('[name=day]')).nativeElement as HTMLInputElement;
        const month = debugElem.query(By.css('[name=month]')).nativeElement as HTMLSelectElement;
        const year = debugElem.query(By.css('[name=year]')).nativeElement as HTMLInputElement;

        return { day, month, year };
    }

    function setViewValue(value: { day?: any; month?: any; year?: any }) {
        const view = getView();

        view.day.value = value.day ? value.day + '' : '';
        view.day.dispatchEvent(new Event('input'));

        const month = value.month ? `${value.month}: ${value.month}` : null;
        Array.from(view.month.options).filter((o) => o.value === month)[0]!.selected = true;
        view.month.dispatchEvent(new Event('change'));

        view.year.value = value.year ? value.year + '' : '';
        view.year.dispatchEvent(new Event('input'));
    }

    function assertThatFormElementsAreSetupInView() {
        fixture.whenStable().then(() => {
            const view = getView();

            expect(view.day.value).toBe('');
            expect(view.month.options.length).toBe(13);
            expect(view.year.value).toBe('');
        });
    }

    function assertThatFormElementsAreDisabledInView() {
        component.isDisabled = true;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const view = getView();

            expect(view.day.disabled).withContext('expected day to be disabled').toBeTrue();
            expect(view.month.disabled).withContext('expected month to be disabled').toBeTrue();
            expect(view.year.disabled).withContext('expected month to be disabled').toBeTrue();
        });
    }

    function assertThatViewValueChangeTriggersModelChange() {
        fixture.whenStable().then(() => {
            const value = { day: 1, month: 1, year: 1970 };
            setViewValue({ day: 1, month: 1, year: 1970 });

            fixture.detectChanges();

            expect(component.date.getDate()).withContext('unexpected day').toBe(value.day);
            expect(component.date.getMonth())
                .withContext('unexpected month')
                .toBe(value.month - 1);
            expect(component.date.getFullYear()).withContext('unexpected year').toBe(value.year);
            expect(component.date.getHours()).withContext('unexpected hours').toBe(12);
            expect(component.date.getMinutes()).withContext('unexpected minutes').toBe(0);
            expect(component.date.getSeconds()).withContext('unexpected seconds').toBe(0);
            expect(component.date.getMilliseconds()).withContext('unexpected milliseconds').toBe(0);
        });
    }

    function assertThatInputHasIsDateTimeError() {
        fixture.whenStable().then(() => {
            setViewValue({ day: 1, month: 1, year: 'invalid' });
            fixture.detectChanges();

            const form = debugElem.children[0]?.injector.get(NgForm);
            const dateControl = form?.control.get('date-ctrl');

            expect(dateControl?.hasError('isdatetime')).withContext('expected error: isdatetime').toBeTrue();
        });
    }

    function assertThatInputHasIsDateTimeErrorForInvalidDates() {
        fixture.whenStable().then(() => {
            setViewValue({ day: 2, month: 2, year: 'ee' });
            fixture.detectChanges();

            const form = debugElem.children[0]?.injector.get(NgForm);
            const dateControl = form?.control.get('date-ctrl');

            expect(dateControl?.hasError('isdatetime')).withContext('expected error: isdatetime').toBeTrue();
        });
    }
});
