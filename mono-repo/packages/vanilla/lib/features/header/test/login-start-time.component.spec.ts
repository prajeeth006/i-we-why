import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginStartTimeComponent } from '../src/login-start-time/login-start-time.component';

describe('LoginStartTimeComponent', () => {
    let fixture: ComponentFixture<LoginStartTimeComponent>;
    let component: LoginStartTimeComponent;
    let authServiceMock: AuthServiceMock;
    let commonMessagesMock: CommonMessagesMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        authServiceMock = MockContext.useMock(AuthServiceMock);
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.overrideComponent(LoginStartTimeComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
                imports: [],
            },
        });

        commonMessagesMock['LoginStartTime'] = 'test: {login_start_time}';
    });

    function initComponent() {
        fixture = TestBed.createComponent(LoginStartTimeComponent);
        component = fixture.componentInstance;
    }

    describe('init()', () => {
        it('should set login start time', fakeAsync(() => {
            initComponent();

            fixture.detectChanges();

            runTest();
        }));

        it('should set login start time on user login', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            initComponent();
            fixture.detectChanges();
            userServiceMock.triggerEvent(new UserLoginEvent());

            runTest();
        }));

        function runTest() {
            authServiceMock.loginStartTime.resolve('25/05/2019 10:00');
            tick();

            expect(authServiceMock.loginStartTime).toHaveBeenCalled();
            expect(component.message).toBe('test: <span class="start-time">25/05/2019 10:00</span>');
        }
    });
});
