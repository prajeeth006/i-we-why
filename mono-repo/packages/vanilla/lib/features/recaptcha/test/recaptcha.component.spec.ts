import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { ReCaptchaComponent } from '../src/recaptcha.component';
import { ReCaptchaConfigMock } from './recaptcha-config.mock';

describe('ReCaptchaComponent', () => {
    let fixture: ComponentFixture<ReCaptchaComponent>;
    let component: ReCaptchaComponent;
    let reCaptchaConfigMock: ReCaptchaConfigMock;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        reCaptchaConfigMock = MockContext.useMock(ReCaptchaConfigMock);
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ReCaptchaComponent);
        component = fixture.componentInstance;
    });

    function init() {
        const recaptchaEnterpriseComponent = jasmine.createSpyObj('RecaptchaEnterpriseComponent', ['reset', 'execute']);

        component.recaptchaEnterpriseComponent = recaptchaEnterpriseComponent;
        component.componentInstance = recaptchaEnterpriseComponent;
        component.area = 'test';

        fixture.detectChanges();
    }

    describe('ngOnInit', () => {
        it('should set enabled to true if getIsEnabled returns true', fakeAsync(() => {
            init();

            reCaptchaConfigMock.whenReady.next();
            sharedFeaturesApiServiceMock.get.withArgs('recaptcha/enabled', { area: component.area }).and.returnValue(of({ enabled: true }));
            tick();

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('recaptcha/enabled', { area: component.area });
            expect(component.enabled).toBeTrue();
            expect(component.isEnabled()).toBeTrue();
        }));
    });

    describe('reset', () => {
        it('should reset the reCaptcha', () => {
            init();
            const resolvedSpy = spyOn(component.resolved, 'next');

            component.reset();

            expect(component.recaptchaEnterpriseComponent.reset).toHaveBeenCalledTimes(1);
            expect(resolvedSpy).toHaveBeenCalledOnceWith(null);
        });
    });

    describe('execute', () => {
        it('should execute the reCaptcha if enabled', fakeAsync(() => {
            init();
            component.enabled = true;

            component.execute();
            component.initialized.next(true);
            reCaptchaConfigMock.whenReady.next();
            tick();

            expect(component.recaptchaEnterpriseComponent.execute).toHaveBeenCalledTimes(1);
            expect(loggerMock.errorRemote).not.toHaveBeenCalled();
        }));

        it('should log error if initialization fails', fakeAsync(() => {
            init();
            component.enabled = true;

            component.execute();
            component.initialized.error('error');
            reCaptchaConfigMock.whenReady.next();
            tick();

            expect(loggerMock.errorRemote).toHaveBeenCalledOnceWith('RecaptchaEnterprise initialization failed.', 'error');
        }));

        it('should log error if reCaptcha component is not ready', fakeAsync(() => {
            component.enabled = true;

            component.execute();
            component.initialized.next(true);
            reCaptchaConfigMock.whenReady.next();
            tick();

            expect(loggerMock.errorRemote).toHaveBeenCalledOnceWith('RecaptchaEnterprise is enabled but component was not ready to execute.', null);
        }));
    });

    describe('reload', () => {
        it('should reload the reCaptcha if enabled', fakeAsync(() => {
            init();
            sharedFeaturesApiServiceMock.get.withArgs('recaptcha/enabled', { area: component.area }).and.returnValue(of({ enabled: true }));
            component.isEnabled.set(true);

            component.reload();
            tick();

            expect(component.recaptchaEnterpriseComponent.reset).toHaveBeenCalledTimes(1);
        }));

        it('should not reset the reCaptcha if not enabled', fakeAsync(() => {
            init();
            sharedFeaturesApiServiceMock.get.withArgs('recaptcha/enabled', { area: component.area }).and.returnValue(of({ enabled: true }));

            component.reload();
            tick();

            expect(component.recaptchaEnterpriseComponent.reset).not.toHaveBeenCalled();
            expect(component.isEnabled()).toBeTrue();
        }));
    });

    describe('onResolved', () => {
        it('should emit resolved', () => {
            const resolvedSpy = spyOn(component.resolved, 'next');

            component.onResolved('response');

            expect(resolvedSpy).toHaveBeenCalledOnceWith('response');
        });
    });
});
