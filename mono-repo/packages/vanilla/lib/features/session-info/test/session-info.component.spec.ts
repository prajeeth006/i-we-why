import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TimeFormat, TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UnitFormat } from '../../../core/src/time/time.models';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { WindowOffsetModifierServiceMock } from '../../../core/test/browser/window-offset-modifier.service.mock';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { SessionInfoComponent } from '../src/session-info.component';
import { SessionInfo } from '../src/session-info.models';
import { SessionInfoConfigMock } from './session-info-config.mock';
import { SessionInfoResourceServiceMock } from './session-info.mock';

describe('SessionInfoComponent', () => {
    let fixture: ComponentFixture<SessionInfoComponent>;
    let component: SessionInfoComponent;
    let overlayRefMock: OverlayRefMock;
    let sessionInfoResourceServiceMock: SessionInfoResourceServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let intlServiceMock: IntlServiceMock;
    let userServiceMock: UserServiceMock;
    let clockServiceMock: ClockServiceMock;

    const sessionInfo: SessionInfo = {
        balance: 2565,
        elapsedTime: 3750000,
        totalWagerAmt: 3369,
    };

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        sessionInfoResourceServiceMock = MockContext.useMock(SessionInfoResourceServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        MockContext.useMock(SessionInfoConfigMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(WindowOffsetModifierServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        intlServiceMock.formatCurrency.withArgs(25.65).and.returnValue('$25.65');
        intlServiceMock.formatCurrency.withArgs(33.69).and.returnValue('$33.69');
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('01:02');
    });

    function initComponent() {
        fixture = TestBed.createComponent(SessionInfoComponent);
        fixture.componentRef.setInput('sessionInfo', sessionInfo);
        component = fixture.componentInstance;
    }

    describe('init', () => {
        it('should set login duration and winnings', () => {
            initComponent();
            fixture.detectChanges();

            expect(messageQueueServiceMock.clear).toHaveBeenCalledWith({
                scope: 'sessioninfo',
                clearPersistent: false,
            });
            expect(component.loginDuration()).toBe('01:02 hours');
            expect(component.winningsLosses()).toBe('$25.65');
            expect(component.totalWager()).toBe('$33.69');
            expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(25.65);
            expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(33.69);
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(new TimeSpan(sessionInfo.elapsedTime), {
                hideZeros: false,
                timeFormat: TimeFormat.HM,
                unitFormat: UnitFormat.Hidden,
            });
        });
    });

    describe('close()', () => {
        it('should call rcpuContinue API and close the overlay', fakeAsync(() => {
            initComponent();
            component.close();

            expect(sessionInfoResourceServiceMock.rcpuContinue).toHaveBeenCalled();

            sessionInfoResourceServiceMock.rcpuContinue.resolve();
            tick();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));

        it('should NOT call rcpuContinue API if user is unauthenticated', () => {
            userServiceMock.isAuthenticated = false;
            initComponent();
            component.close();

            expect(sessionInfoResourceServiceMock.rcpuContinue).not.toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('logout()', () => {
        it('should call rcpuQuit API and close the overlay', fakeAsync(() => {
            initComponent();
            component.logout();

            expect(sessionInfoResourceServiceMock.rcpuQuit).toHaveBeenCalled();

            sessionInfoResourceServiceMock.rcpuQuit.resolve();
            tick();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));

        it('should NOT call rcpuQuit API if user is unauthenticated', () => {
            userServiceMock.isAuthenticated = false;
            initComponent();
            component.logout();

            expect(sessionInfoResourceServiceMock.rcpuQuit).not.toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
