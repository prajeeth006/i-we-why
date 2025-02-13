import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserEvent, UserLogoutEvent, UserSessionExpiredEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SelfExclusionBootstrapService } from '../src/self-exclusion-bootstrap.service';
import { SelfExclusionConfigMock, SelfExclusionServiceMock } from './self-exclusion.mock';

describe('SelfExclusionBootstrapService', () => {
    let service: SelfExclusionBootstrapService;
    let configMock: SelfExclusionConfigMock;
    let serviceMock: SelfExclusionServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        serviceMock = MockContext.useMock(SelfExclusionServiceMock);
        configMock = MockContext.useMock(SelfExclusionConfigMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SelfExclusionBootstrapService],
        });
        service = TestBed.inject(SelfExclusionBootstrapService);
    });

    describe('onFeatureInit', () => {
        testStopPolling(new UserSessionExpiredEvent());
        testStopPolling(new UserLogoutEvent());

        function testStopPolling(event: UserEvent) {
            it('should stop polling after user session expires', fakeAsync(() => {
                service.onFeatureInit();
                configMock.whenReady.next();
                tick();
                userServiceMock.triggerEvent(event);

                expect(serviceMock.stopPolling).toHaveBeenCalled();
            }));
        }
    });
});
