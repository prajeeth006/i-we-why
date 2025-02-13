import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { InactivityScreenBootstrapService } from '../src/inactivity-screen-bootstrap.service';
import { InactivityScreenConfigMock } from './inactivity-screen-config.mock';
import { InactivityScreenOverlayServiceMock } from './inactivity-screen-overlay-service.mock';
import { InactivityScreenServiceMock } from './inactivity-screen.mock';

describe('InactivityScreenBootstrapService', () => {
    let service: InactivityScreenBootstrapService;
    let inactivityScreenService: InactivityScreenServiceMock;
    let inactivityScreenOverlayServiceMock: InactivityScreenOverlayServiceMock;
    let inactivityScreenConfigMock: InactivityScreenConfigMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        inactivityScreenOverlayServiceMock = MockContext.useMock(InactivityScreenOverlayServiceMock);
        inactivityScreenConfigMock = MockContext.useMock(InactivityScreenConfigMock);
        inactivityScreenService = MockContext.useMock(InactivityScreenServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactivityScreenBootstrapService],
        });

        service = TestBed.inject(InactivityScreenBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should subscribe on whenIdle when authenticated', fakeAsync(() => {
            service.onFeatureInit();
            inactivityScreenConfigMock.whenReady.next();
            tick();

            validateTest();
        }));

        it('should subscribe on whenIdle on user login', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;

            service.onFeatureInit();
            inactivityScreenConfigMock.whenReady.next();
            tick();

            userServiceMock.triggerEvent(new UserLoginEvent());

            validateTest();
        }));

        function validateTest() {
            expect(inactivityScreenService.whenIdle).toHaveBeenCalled();

            inactivityScreenService.whenIdle.next();

            expect(inactivityScreenOverlayServiceMock.showCountdownOverlay).toHaveBeenCalled();
        }
    });
});
