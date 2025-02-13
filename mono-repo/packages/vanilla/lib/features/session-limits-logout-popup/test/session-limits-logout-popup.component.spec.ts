import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ViewTemplateForClient } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { SessionLimitsTrackingServiceMock } from '../../session-limits/test/session-limits.mocks';
import { SessionLimitsLogoutPopupComponent } from '../src/session-limits-logout-popup.component';
import { SessionLimitsLogoutPopupConfigMock } from './session-limits-logout-popup.mock';

describe('SessionLimitsLogoutPopupComponent', () => {
    let fixture: ComponentFixture<SessionLimitsLogoutPopupComponent>;
    let overlayRefMock: OverlayRefMock;
    let sessionLimitsLogoutPopupContentMock: SessionLimitsLogoutPopupConfigMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let authServiceMock: AuthServiceMock;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        sessionLimitsLogoutPopupContentMock = MockContext.useMock(SessionLimitsLogoutPopupConfigMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        MockContext.useMock(SessionLimitsTrackingServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        sessionLimitsLogoutPopupContentMock.content = (<any>{
            text: '{SESSION_LIMITS}',
            messages: {
                hour: 'hour',
                hours: 'hours',
            },
            form: {
                accept: {
                    label: 'ok',
                    htmlAttributes: {
                        class: 'button-class',
                    },
                },
            },
        }) as ViewTemplateForClient;

        fixture = TestBed.createComponent(SessionLimitsLogoutPopupComponent);
    });

    describe('init', () => {
        it('should set text with value hours', () => {
            fixture.componentRef.setInput('currentLimit', 720);
            fixture.detectChanges();

            expect(fixture.componentInstance.content()).toBe(sessionLimitsLogoutPopupContentMock.content);
            expect(fixture.componentInstance.text()).toBe('12 hours');
        });

        it('should set text with text hour', () => {
            fixture.componentRef.setInput('currentLimit', 60);

            fixture.detectChanges();

            expect(fixture.componentInstance.text()).toBe('1 hour');
        });
    });

    describe('accept()', () => {
        it('should logout the user', fakeAsync(() => {
            fixture.componentRef.setInput('currentLimit', 60);
            fixture.detectChanges();

            fixture.componentInstance.accept();
            expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false });
            authServiceMock.logout.resolve();

            tick();
            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(loginNavigationServiceMock.goToLogin).toHaveBeenCalled();
        }));
    });
});
