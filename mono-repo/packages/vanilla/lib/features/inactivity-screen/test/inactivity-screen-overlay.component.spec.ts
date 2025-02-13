import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType, TimeFormat, TimeSpan, UnitFormat, WINDOW, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { CoreLoginDialogServiceMock as LoginDialogServiceMock } from '../../login/test/login.mocks';
import { InactivityScreenOverlayComponent } from '../src/inactivity-screen-overlay.component';
import { InactivityMode } from '../src/inactivity-screen.models';
import { InactivityScreenConfigMock } from './inactivity-screen-config.mock';
import { InactivityScreenOverlayServiceMock } from './inactivity-screen-overlay-service.mock';
import { InactivityScreenTrackingServiceMock } from './inactivity-screen-tracking-service.mock';
import { InactivityScreenServiceMock } from './inactivity-screen.mock';

describe('InactivityScreenOverlayComponent', () => {
    let fixture: ComponentFixture<InactivityScreenOverlayComponent>;
    let component: InactivityScreenOverlayComponent;
    let inactivityScreenConfigMock: InactivityScreenConfigMock;
    let inactivityScreenServiceMock: InactivityScreenServiceMock;
    let authServiceMock: AuthServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let loginDialogServiceMock: LoginDialogServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let userServiceMock: UserServiceMock;
    let clockServiceMock: ClockServiceMock;
    let overlayRefMock: OverlayRefMock;
    let windowMock: WindowMock;
    let inactivityScreenOverlayServiceMock: InactivityScreenOverlayServiceMock;
    const worker = new Worker('');

    beforeEach(() => {
        inactivityScreenConfigMock = MockContext.useMock(InactivityScreenConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        inactivityScreenServiceMock = MockContext.useMock(InactivityScreenServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        loginDialogServiceMock = MockContext.useMock(LoginDialogServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        windowMock = new WindowMock();
        inactivityScreenOverlayServiceMock = MockContext.useMock(InactivityScreenOverlayServiceMock);
        MockContext.useMock(InactivityScreenTrackingServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(LoginNavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        const resources: any = {
            messages: {
                Overlay_CountdownMessage: '{0}',
                Overlay_LogoutMessage: 'logout',
                Overlay_Text_Betstation: 'You have 00min',
            },
        };
        inactivityScreenConfigMock.resources = resources;
        inactivityScreenConfigMock.overlay = resources;
        webWorkerServiceMock.createWorker.and.returnValue(worker);
        windowMock.document.hidden = false;
    });

    function createComponent() {
        fixture = TestBed.createComponent(InactivityScreenOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe('ngOnInit', () => {
        it('should init values and logout for betstation grid user', fakeAsync(() => {
            createComponent();
            clockServiceMock.toTotalTimeStringFormat.and.returnValue('00:07');
            const detectChangesSpy = spyOn(component['changeDetectorRef'], 'detectChanges');

            expect(component.messages).toEqual({
                Overlay_CountdownMessage: '{0}',
                Overlay_LogoutMessage: 'logout',
                Overlay_Text_Betstation: 'You have 00min',
            });

            expect(component.text).toBe('You have 00min');
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledOnceWith(
                TimeSpan.fromSeconds(inactivityScreenConfigMock.countdownTimeout),
                {
                    timeFormat: TimeFormat.MS,
                    hideZeros: false,
                    unitFormat: UnitFormat.Hidden,
                },
            );
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.InactivityScreenInterval,
                { interval: 1000, runInsideAngularZone: true },
                jasmine.any(Function),
            );
            expect(component.percentageElapsed()).toBe(100);

            component.currentCountdown = 0;
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(detectChangesSpy).toHaveBeenCalled();
            expect(authServiceMock.logout).toHaveBeenCalledOnceWith({
                closeOverlay: false,
                showLoginDialog: false,
                redirectAfterLogout: false,
                isManualLogout: false,
            });

            authServiceMock.logout.resolve();
            tick();

            expect(eventsServiceMock.raise).toHaveBeenCalledOnceWith({ eventName: NativeEventType.RESET_TERMINAL });
            expect(loginDialogServiceMock.open).toHaveBeenCalledTimes(0);
        }));

        it('should only send CCB event for anonymous user', () => {
            userServiceMock.isAnonymous = true;
            createComponent();

            component.currentCountdown = 0;
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: NativeEventType.RESET_TERMINAL });
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.RESET_TERMINAL });
        });

        it('should subscribe to activity', () => {
            createComponent();

            inactivityScreenServiceMock.activity.next({});

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.InactivityScreenInterval);
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });

        it('continue should prolong the session', () => {
            inactivityScreenConfigMock.prolongSession = true;
            inactivityScreenConfigMock.mode = InactivityMode.Web;
            userServiceMock.isAuthenticated = true;
            createComponent();

            component.continue();

            expect(authServiceMock.ping).toHaveBeenCalled();
        });

        it('after logout should open session overlay', fakeAsync(() => {
            inactivityScreenConfigMock.mode = InactivityMode.Web;
            userServiceMock.isAuthenticated = true;
            inactivityScreenConfigMock.enableSessionPopup = true;
            createComponent();

            component.logout();

            authServiceMock.logout.resolve();

            tick();
            expect(inactivityScreenOverlayServiceMock.showSessionOverlay).toHaveBeenCalled();
        }));

        it('should logout and redirect for webVersion 2', () => {
            inactivityScreenConfigMock.webVersion = 2;
            createComponent();

            component.logout();

            expect(authServiceMock.logout).toHaveBeenCalledWith({
                closeOverlay: false,
                showLoginDialog: false,
                redirectAfterLogout: true,
                isManualLogout: false,
            });
        });
    });
});
