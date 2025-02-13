import { TestBed } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { InactiveBootstrapService } from '../src/inactive-bootstrap.service';
import { InactiveConfigMock, InactiveServiceMock } from './inactive.mock';

describe('InactiveBootstrapService', () => {
    let service: InactiveBootstrapService;
    let inactiveConfigMock: InactiveConfigMock;
    let inactiveServiceMock: InactiveServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        inactiveConfigMock = MockContext.useMock(InactiveConfigMock);
        inactiveServiceMock = MockContext.useMock(InactiveServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactiveBootstrapService],
        });

        service = TestBed.inject(InactiveBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should call init when user is authenticated', () => {
            service.onFeatureInit();
            inactiveConfigMock.whenReady.next();

            expect(inactiveServiceMock.init).toHaveBeenCalled();
        });

        it('should call init when user log in', () => {
            userServiceMock.isAuthenticated = false;
            service.onFeatureInit();
            inactiveConfigMock.whenReady.next();

            expect(inactiveServiceMock.init).not.toHaveBeenCalled();

            userServiceMock.triggerEvent(new UserLoginEvent());

            expect(inactiveServiceMock.init).toHaveBeenCalled();
        });
    });
});
