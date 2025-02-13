import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem, WorkerType } from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { SessionLimitsOverlayComponent } from '../src/session-limits-overlay.component';
import { SessionLimitNotification, SessionLimitType } from '../src/session-limits.models';
import { SessionLimitsConfigMock, SessionLimitsTrackingServiceMock } from './session-limits.mocks';

describe('SessionLimitsOverlayComponent', () => {
    let fixture: ComponentFixture<SessionLimitsOverlayComponent>;
    let component: SessionLimitsOverlayComponent;
    let sessionLimitsConfigMock: SessionLimitsConfigMock;
    let overlayRefMock: OverlayRefMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let sessionLimitsTrackingServiceMock: SessionLimitsTrackingServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let urlServiceMock: UrlServiceMock;
    let sessionLimitsNotification: SessionLimitNotification;

    beforeEach(() => {
        sessionLimitsConfigMock = MockContext.useMock(SessionLimitsConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        sessionLimitsTrackingServiceMock = MockContext.useMock(SessionLimitsTrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        MockContext.useMock(SharedFeaturesApiServiceMock);
        MockContext.useMock(AuthServiceMock);

        sessionLimitsNotification = {
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

        TestBed.overrideComponent(SessionLimitsOverlayComponent, {
            set: {
                imports: [TrustAsHtmlPipe, FormatPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        sessionLimitsConfigMock.closeWaitingTime = 3; // In seconds
        sessionLimitsConfigMock.content = <any>{
            messages: {
                CloseMessage: 'You can close this message in {0} seconds',
                SessionLimits: 'SessionLimit',
                LoginDurationLimits: 'LoginDurationLimits',
            },
        };
        sessionLimitsConfigMock.updateCTA = <MenuContentItem>{
            trackEvent: {
                eventName: 'Test',
                data: {
                    eventDetails: '__limits__',
                },
            },
        };
        sessionLimitsConfigMock.version = 1;
        sessionLimitsTrackingServiceMock.getLimitsType.and.returnValue('Daily/Weekly');

        fixture = TestBed.createComponent(SessionLimitsOverlayComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('sessionLimitsNotification', sessionLimitsNotification);

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should set tracking placeholder', () => {
            expect(sessionLimitsTrackingServiceMock.getLimitsType).toHaveBeenCalledOnceWith(sessionLimitsNotification.sessionLimits);
            expect(sessionLimitsConfigMock.updateCTA.trackEvent.data).toEqual({ eventDetails: 'Daily/Weekly' });
        });

        it('should track, set content and init countdown', () => {
            expect(sessionLimitsTrackingServiceMock.trackLoad).toHaveBeenCalledOnceWith(sessionLimitsNotification);

            expect(component.countdown()).toBe(3);
            expect(component.buttonsDisabled()).toBeTrue();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.SessionLimitsInterval,
                {
                    interval: 1000,
                    runInsideAngularZone: true,
                },
                jasmine.any(Function),
            );
        });

        it('should update the countdown', () => {
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(component.countdown()).toBe(2);
        });

        it('should remove the worker when countdown is 0', () => {
            sessionLimitsConfigMock.closeWaitingTime = 1; // In seconds
            component.ngOnInit();

            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(component.countdown()).toBe(0);
            expect(component.buttonsDisabled()).toBeFalse();
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.SessionLimitsInterval);
        });

        it('should close overlay on location change', () => {
            const previousUrl = new ParsedUrlMock();
            const nextUrl = new ParsedUrlMock();
            previousUrl.absUrl.and.returnValue('pretest.party.pop');
            nextUrl.absUrl.and.returnValue('nexttest.party.pop');

            urlServiceMock.parse.withArgs('pUrl').and.callFake(() => previousUrl);
            urlServiceMock.parse.withArgs('nUrl').and.callFake(() => nextUrl);

            fixture.detectChanges();
            navigationServiceMock.locationChange.next({ id: 0, nextUrl: 'pUrl', previousUrl: 'nUrl' });

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove Web worker', () => {
            fixture.destroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.SessionLimitsInterval);
        });
    });

    describe('close', () => {
        it('should track and close the overlay', () => {
            component.close();

            expect(sessionLimitsTrackingServiceMock.trackClose).toHaveBeenCalledOnceWith(sessionLimitsNotification);
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
