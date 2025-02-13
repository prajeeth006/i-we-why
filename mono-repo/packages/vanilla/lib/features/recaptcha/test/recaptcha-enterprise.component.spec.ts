import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { RecaptchaEnterpriseComponent } from '../src/recaptcha-enterprise.component';
import { RecaptchaEnterpriseServiceMock } from './recaptcha.mock';

describe('RecaptchaEnterpriseComponent', () => {
    let fixture: ComponentFixture<RecaptchaEnterpriseComponent>;
    let component: RecaptchaEnterpriseComponent;
    let recaptchaEnterpriseServiceMock: RecaptchaEnterpriseServiceMock;

    beforeEach(() => {
        recaptchaEnterpriseServiceMock = MockContext.useMock(RecaptchaEnterpriseServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(RecaptchaEnterpriseComponent);
        component = fixture.componentInstance;
        component.action = 'test';
        component.reCaptchaContainer = jasmine.createSpyObj('captchaWrapperElem', ['nativeElement']);

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should init reCaptcha API and render when ready', fakeAsync(() => {
            expect(recaptchaEnterpriseServiceMock.action).toBe(component.action);
            expect(recaptchaEnterpriseServiceMock.initReCaptchaAPI).toHaveBeenCalledTimes(1);

            recaptchaEnterpriseServiceMock.scriptLoaded.next(true);
            tick();

            expect(recaptchaEnterpriseServiceMock.renderRecaptcha).toHaveBeenCalledOnceWith(component.reCaptchaContainer.nativeElement);

            const successSpy = spyOn(component.success, 'next');
            recaptchaEnterpriseServiceMock.success.next('token');

            expect(successSpy).toHaveBeenCalledOnceWith('token');
        }));
    });

    describe('registerOnChange', () => {
        it('should register onChange', () => {
            const fn = jasmine.createSpy();
            component.registerOnChange(fn);

            expect(component.onChange).toBe(fn);
        });
    });

    describe('registerOnTouched', () => {
        it('should register onTouched', () => {
            const fn = jasmine.createSpy();
            component.registerOnTouched(fn);

            expect(component.onTouched).toBe(fn);
        });
    });

    describe('execute', () => {
        it('should execute recaptcha', () => {
            component.execute();

            expect(recaptchaEnterpriseServiceMock.executeRecaptcha).toHaveBeenCalledOnceWith(component.action);
        });
    });

    describe('reset', () => {
        it('should reset recaptcha', () => {
            component.reset();

            expect(recaptchaEnterpriseServiceMock.resetCaptcha).toHaveBeenCalledOnceWith();
        });
    });
});
