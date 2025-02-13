import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { RememberMeLogoutPromptComponent } from '@frontend/vanilla/features/remember-me-logout-prompt';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { RememberMeServiceMock } from '../../../core/test/login/remember-me/remember-me.service.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { RememberMeLogoutPromptConfigMock } from './remember-me-logout-prompt.mocks';

describe('RememberMeLogoutPromptComponent', () => {
    let fixture: ComponentFixture<RememberMeLogoutPromptComponent>;
    let nativeAppService: NativeAppServiceMock;
    let rememberMeService: RememberMeServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        nativeAppService = MockContext.useMock(NativeAppServiceMock);
        rememberMeService = MockContext.useMock(RememberMeServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(RememberMeLogoutPromptConfigMock);

        TestBed.configureTestingModule({
            declarations: [],
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(RememberMeLogoutPromptComponent, { set: { imports: [TrustAsHtmlPipe], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(RememberMeLogoutPromptComponent);

        fixture.detectChanges();
    });

    describe('rememberMe', () => {
        it('should send event to native', () => {
            fixture.componentInstance.rememberMe();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
            expect(nativeAppService.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.REMEMBER_ME_CLOSE,
            });
        });
    });

    describe('close', () => {
        it('should logout from remember me and send event', fakeAsync(() => {
            fixture.componentInstance.close();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalled();
            expect(rememberMeService.logout).toHaveBeenCalledWith();

            rememberMeService.logout.completeWith();
            tick();

            expect(nativeAppService.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.REMEMBER_ME_CLOSE,
            });
        }));
    });
});
