import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { CookieName } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { SessionLimitsOverlayComponent } from '../src/session-limits-overlay.component';
import { SessionLimitsOverlayService } from '../src/session-limits-overlay.service';
import { SessionLimitNotification, SessionLimitType } from '../src/session-limits.models';

describe('SessionLimitsOverlayService', () => {
    let service: SessionLimitsOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;
    let cookieServiceMock: CookieServiceMock;
    let userServiceMock: UserServiceMock;

    const sessionLimitsNotification: SessionLimitNotification = {
        accountName: 'name',
        frontend: 'fe',
        useCase: 'use_case',
        sessionLimits: [
            {
                percentageElapsed: 82,
                sessionLimitConfiguredMins: 150,
                sessionLimitElaspedMins: 130,
                sessionLimitType: SessionLimitType.DAILY_LIMIT,
            },
        ],
        isSessionExpired: false,
    };

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionLimitsOverlayService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(SessionLimitsOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(sessionLimitsNotification);

            const expectedConfig = {
                panelClass: ['vn-session-limits-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<SessionLimitsOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(SessionLimitsOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
            expect(cookieServiceMock.remove).toHaveBeenCalledOnceWith(CookieName.SessionLimits);
        });

        it('should not open overlay multiple times', () => {
            service.show(sessionLimitsNotification);
            service.show(sessionLimitsNotification);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('handlePendingLimits', () => {
        it('should handle pending limit', () => {
            const showSpy = spyOn(service, 'show');

            userServiceMock.globalSession = '123';
            sessionLimitsNotification.fromSource = 'postlogin';
            sessionLimitsNotification.loginSessionLimitActivity = [
                {
                    accountName: '',
                    globalSessionId: '123',
                },
            ];

            service.handlePendingLimits(sessionLimitsNotification);

            expect(showSpy).toHaveBeenCalledOnceWith(sessionLimitsNotification);
        });
    });
});
