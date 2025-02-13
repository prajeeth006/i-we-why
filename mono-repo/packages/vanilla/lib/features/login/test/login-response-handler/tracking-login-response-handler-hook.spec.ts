import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UtilsService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { ToastrQueueServiceMock } from '../../../../core/test/toastr/toastr-queue.mock';
import { TrackingLoginResponseHandlerHook } from '../../src/login-response-handler/tracking-login-response-handler-hook';
import { LoginServiceMock } from '../login.mocks';

describe('TrackingLoginResponseHandlerHook', () => {
    let hook: TrackingLoginResponseHandlerHook;
    let trackingServiceMock: TrackingServiceMock;
    let loginServiceMock: LoginServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(ToastrQueueServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TrackingLoginResponseHandlerHook, UtilsService],
        });

        hook = TestBed.inject(TrackingLoginResponseHandlerHook);
    });

    describe('onPostLogin', () => {
        it('should update user values', fakeAsync(() => {
            hook.onPostLogin(<any>{});
            expect(loginServiceMock.logSuperCookie).toHaveBeenCalledWith('onPostLogin');
            trackingServiceMock.updateUserValues.resolve();
            tick();

            expect(trackingServiceMock.updateUserValues).toHaveBeenCalled();
        }));
    });
});
