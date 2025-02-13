import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SessionStoreKey, SlotName, TimeFormat, TimeSpan, UnitFormat, UserLogoutEvent, UserUpdateEvent, WorkerType } from '@frontend/vanilla/core';
import { LoginDurationComponent } from '@frontend/vanilla/features/login-duration';
import { MockContext } from 'moxxi';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { CurrentSessionConfigMock } from './current-session.mock';
import { LoginDurationConfigMock } from './login-duration-config.mock';
import { LoginDurationTrackingServiceMock } from './login-duration-tracking.service.mock';

describe('LoginDurationComponent', () => {
    let fixture: ComponentFixture<LoginDurationComponent>;
    let component: LoginDurationComponent;
    let userServiceMock: UserServiceMock;
    let loginDurationConfigMock: LoginDurationConfigMock;
    let htmlNodeMock: HtmlNodeMock;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let loginDurationTrackingServiceMock: LoginDurationTrackingServiceMock;
    let sessionStoreServiceMock: SessionStoreServiceMock;
    let currentSessionConfigMock: CurrentSessionConfigMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let clockServiceMock: ClockServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        loginDurationConfigMock = MockContext.useMock(LoginDurationConfigMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        loginDurationTrackingServiceMock = MockContext.useMock(LoginDurationTrackingServiceMock);
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);
        currentSessionConfigMock = MockContext.useMock(CurrentSessionConfigMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        MockContext.useMock(NavigationServiceMock);

        currentSessionConfigMock.loginDuration = 3661000;
        loginDurationConfigMock.slotName = SlotName.Header;
        loginDurationConfigMock.timeFormat = TimeFormat.HMS;
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('01:00:00');

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(LoginDurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe('ngOnInit', () => {
        it('should show time since login', fakeAsync(() => {
            initComponent();

            const detectChangesSpy = spyOn(component['changeDetectorRef'], 'detectChanges');

            tick();

            expect(component.message()).toBe('login duration: <span class="login-duration-time">01:00:00</span>');

            tick(1000);

            expect(detectChangesSpy).toHaveBeenCalled();
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(new TimeSpan(3661000), {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: loginDurationConfigMock.timeFormat,
            });
        }));

        it('should use login start time from session store', fakeAsync(() => {
            sessionStoreServiceMock.get.and.returnValue(3600000);

            initComponent();
            tick(1000);

            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(new TimeSpan(3600000), {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: loginDurationConfigMock.timeFormat,
            });
            expect(sessionStoreServiceMock.get).toHaveBeenCalledOnceWith(SessionStoreKey.ClientLoginDuration);
            expect(sessionStoreServiceMock.remove).toHaveBeenCalledOnceWith(SessionStoreKey.ClientLoginDuration);
        }));

        it('should add css class to html node', fakeAsync(() => {
            initComponent();

            tick(1000);

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('header-login-duration-shown', true);
        }));

        it('should set durationWithoutText property if no text configured aside from duration placeholder', fakeAsync(() => {
            loginDurationConfigMock.text = '{duration}';

            initComponent();
            tick(1000);

            expect(component.isDurationTextHidden()).toBeTrue();
        }));

        it('should not show when user is not authenticated', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;

            initComponent();

            expect(component.message()).toBeNull();
        }));

        it('should not show when loginDuration is not set', fakeAsync(() => {
            currentSessionConfigMock.loginDuration = null;

            initComponent();

            expect(component.message()).toBeNull();
        }));

        it('should start counting from loginDuration after login (f.e. finishes workflow)', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            currentSessionConfigMock.loginDuration = null;

            initComponent();

            currentSessionConfigMock.loginDuration = 1000;
            userServiceMock.isAuthenticated = true;
            userServiceMock.triggerEvent(new UserUpdateEvent(new Map<string, any>([['isAuthenticated', true]])));
            clientConfigServiceMock.reload.resolve();
            tick(1000);

            expect(component.message()).toBe('login duration: <span class="login-duration-time">01:00:00</span>');
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledWith(new TimeSpan(1000), {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: loginDurationConfigMock.timeFormat,
            });
        }));

        it('should reload client config if no login duration', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            currentSessionConfigMock.loginDuration = null;

            initComponent();

            expect(clientConfigServiceMock.reload).toHaveBeenCalled();
        }));

        it('should track if authenticated', fakeAsync(() => {
            initComponent();

            const time = new Date(Date.now() - (currentSessionConfigMock.loginDuration ?? 0)).toTimeString();
            tick(1000);

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('header-login-duration-shown', true);
            expect(loginDurationTrackingServiceMock.trackLoad).toHaveBeenCalledOnceWith(time, loginDurationConfigMock.slotName);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.LoginDurationInterval + LoginDurationComponent['instance'],
                {
                    interval: 1000,
                    runInsideAngularZone: true,
                },
                jasmine.any(Function),
            );
        }));

        it('should remove login duration from session store on logout', fakeAsync(() => {
            currentSessionConfigMock.loginDuration = null;
            initComponent();
            clientConfigServiceMock.reload.resolve();
            tick(1000);

            userServiceMock.triggerEvent(new UserLogoutEvent());

            expect(sessionStoreServiceMock.remove).toHaveBeenCalledOnceWith(SessionStoreKey.ClientLoginDuration);
        }));
    });

    describe('ngOnDestroy', () => {
        it('should remove css class from html node when destroyed', fakeAsync(() => {
            loginDurationConfigMock.slotName = SlotName.Header;

            initComponent();

            tick(1000);
            userServiceMock.isAuthenticated = false;

            fixture.destroy();

            expect(component.message()).toBeNull();
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('header-login-duration-shown', false);
            expect(sessionStoreServiceMock.set).toHaveBeenCalledWith(SessionStoreKey.ClientLoginDuration, 3662000);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.LoginDurationInterval + LoginDurationComponent['instance']);
            expect(dynamicLayoutServiceMock.removeComponent).toHaveBeenCalledOnceWith(SlotName.Header, LoginDurationComponent);
        }));
    });
});
