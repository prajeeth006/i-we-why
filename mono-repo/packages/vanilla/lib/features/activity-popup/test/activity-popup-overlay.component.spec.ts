import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { ActivityPopupOverlayComponent } from '../src/activity-popup-overlay.component';
import { ActivityPopupConfigMock, ActivityPopupCookieServiceMock, ActivityPopupTrackingServiceMock } from './activity-popup.mock';

describe('ActivityPopupOverlayComponent', () => {
    let fixture: ComponentFixture<ActivityPopupOverlayComponent>;
    let component: ActivityPopupOverlayComponent;
    let activityPopupConfigMock: ActivityPopupConfigMock;
    let overlayRefMock: OverlayRefMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let authServiceMock: AuthServiceMock;
    let activityPopupCookieServiceMock: ActivityPopupCookieServiceMock;
    let activityPopupTrackingServiceMock: ActivityPopupTrackingServiceMock;

    beforeEach(() => {
        activityPopupConfigMock = MockContext.useMock(ActivityPopupConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        activityPopupCookieServiceMock = MockContext.useMock(ActivityPopupCookieServiceMock);
        activityPopupTrackingServiceMock = MockContext.useMock(ActivityPopupTrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        activityPopupConfigMock.timeout = 120000;
        activityPopupConfigMock.resources = {
            messages: {
                Text: '{MINUTES}',
            },
        };

        fixture = TestBed.createComponent(ActivityPopupOverlayComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('init', () => {
        expect(component.config().resources.messages).toEqual({
            Text: '{MINUTES}',
        });
        expect(component.text()).toBe('2');
        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({
            eventName: NativeEventType.SESSION_NOTIFICATION,
            parameters: {
                timeInMinutes: 2,
            },
        });
        expect(activityPopupTrackingServiceMock.load).toHaveBeenCalledWith(2);
    });

    it('continue', () => {
        component.continue();

        expect(activityPopupCookieServiceMock.write).toHaveBeenCalledWith();
        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.SESSION_NOTIFICATION_CONTINUE });
        expect(overlayRefMock.detach).toHaveBeenCalled();
        expect(activityPopupTrackingServiceMock.continue).toHaveBeenCalledWith(2);
    });

    it('logout', fakeAsync(() => {
        component.logout();

        expect(activityPopupTrackingServiceMock.logout).toHaveBeenCalledWith(2);
        expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false });

        authServiceMock.logout.resolve();
        tick();

        expect(overlayRefMock.detach).toHaveBeenCalled();
    }));
});
