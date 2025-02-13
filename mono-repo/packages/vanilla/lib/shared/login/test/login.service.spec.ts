import { TestBed } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginService } from '../src/login.service';
import { LoginConfigMock } from './login.client-config.mock';

describe('LoginService', () => {
    let service: LoginService;
    let userServiceMock: UserServiceMock;
    let loginConfigMock: LoginConfigMock;
    let dslServiceMock: DslServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginService],
        });

        loginConfigMock.disableFeatureDataPrefetch = { DisabledFeature: 'TRUE', EnabledFeature: 'FALSE' };

        service = TestBed.inject(LoginService);
    });

    describe('runAfterLogin', () => {
        it('should execute provided function on user login if DSL result is false', () => {
            const spy = jasmine.createSpy('fn');

            service.runAfterLogin('EnabledFeature', spy);
            userServiceMock.triggerEvent(new UserLoginEvent());
            loginConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.completeWith(false);

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledOnceWith('FALSE');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should not execute provided function on user login if DSL result is true', () => {
            const spy = jasmine.createSpy('fn');

            service.runAfterLogin('DisabledFeature', spy);
            userServiceMock.triggerEvent(new UserLoginEvent());
            loginConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.completeWith(true);

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledOnceWith('TRUE');
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
