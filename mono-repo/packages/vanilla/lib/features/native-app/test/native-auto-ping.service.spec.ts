import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TimerService, UserLoginEvent, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { NativeAutoPingService } from '../src/native-auto-ping.service';

describe('NativeAutoPingService', () => {
    let service: NativeAutoPingService;
    let userMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    const interval = 360000;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NativeAutoPingService, TimerService],
        });

        service = TestBed.inject(NativeAutoPingService);
    });

    it('should ping in 6 min intervals for authenticated users when in native app', fakeAsync(() => {
        nativeAppServiceMock.isNative = true;

        service.init();
        tick(interval);

        expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(WorkerType.NativeAutoPingInterval, { interval }, jasmine.any(Function));
        expect(apiServiceMock.get).toHaveBeenCalledOnceWith('ping', null, { prefix: '', resolveWithFullResponse: true });
        expect(apiServiceMock.get).toHaveBeenCalledTimes(1);
    }));

    it('should not ping for unauthenticated users', fakeAsync(() => {
        nativeAppServiceMock.isNative = true;
        userMock.isAuthenticated = false;

        service.init();
        tick(interval);

        expect(webWorkerServiceMock.createWorker).not.toHaveBeenCalled();
        expect(apiServiceMock.get).not.toHaveBeenCalled();
    }));

    it('should ping after login', fakeAsync(() => {
        nativeAppServiceMock.isNative = true;
        userMock.isAuthenticated = false;

        service.init();
        userMock.triggerEvent(new UserLoginEvent());
        tick(interval);

        expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(WorkerType.NativeAutoPingInterval, { interval }, jasmine.any(Function));
        expect(apiServiceMock.get).toHaveBeenCalledOnceWith('ping', null, { prefix: '', resolveWithFullResponse: true });
    }));

    function testError(status: number) {
        it(`should stop timer and redirect to native app on ${status} status`, fakeAsync(() => {
            nativeAppServiceMock.isNative = true;
            nativeAppServiceMock.isNativeApp = true;

            service.init();
            tick(interval);
            apiServiceMock.get.error({ status });

            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalled();
        }));
    }

    testError(401);
    testError(403);
});
