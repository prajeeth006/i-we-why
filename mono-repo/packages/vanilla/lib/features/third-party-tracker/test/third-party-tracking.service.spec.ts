import { TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { ThirdPartyTrackingService } from '@frontend/vanilla/features/third-party-tracker';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('ThirdPartyTrackingService', () => {
    let service: ThirdPartyTrackingService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let userMock: UserServiceMock;
    let observableSpy: jasmine.Spy;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(PageMock);
        observableSpy = jasmine.createSpy('observableSpy');

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ThirdPartyTrackingService],
        });

        setTrackingAffiliateCookie(true);
        cookieServiceMock.putObject.and.callFake((name: string, obj: any) => {
            cookieServiceMock.getObject.withArgs(name).and.returnValue(obj);
        });
    });

    function setTrackingAffiliateCookie(exists: boolean) {
        cookieServiceMock.get.withArgs('trackingAffiliate').and.returnValue(exists ? '123' : null);
    }

    describe('enableTracker()', () => {
        beforeEach(() => {
            service = TestBed.inject(ThirdPartyTrackingService);

            service.trackingContent.subscribe(observableSpy);
        });

        it('should enable tracker when trackingAffiliate cookie exists', () => {
            service.enableTracker(11, 22);

            expect(cookieServiceMock.putObject).toHaveBeenCalled();
        });

        it('should NOT enable tracker when trackingAffiliate cookie does NOT exist', () => {
            setTrackingAffiliateCookie(false);

            service.enableTracker(11, 22);

            expect(cookieServiceMock.putObject).not.toHaveBeenCalled();
        });

        it('should enable tracker with correct channelId, productId and correct cookie settings', fakeAsync(() => {
            service.enableTracker(11, 22);

            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            expect(cookieServiceMock.putObject).toHaveBeenCalledWith('thirdPartyTracker', { channelId: 11, productId: 22 }, jasmine.anything());

            const actualExpires = cookieServiceMock.putObject.calls.mostRecent().args[2].expires;

            expect(actualExpires.getTime()).toBeCloseTo(expires.getTime(), -10);
        }));

        it('should call api and publish tracking content if user is authenticated', () => {
            userMock.isAuthenticated = true;

            service.enableTracker(11, 22);

            expect(apiServiceMock.get).toHaveBeenCalledWith('thirdpartytrackingcontent', { channelId: 11, productId: 22 });

            apiServiceMock.get.completeWith({ content: 'trackingContent' });

            expect(observableSpy).toHaveBeenCalledWith('trackingContent');

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
        });

        it('should call api and publish tracking content after user logs in', () => {
            userMock.isAuthenticated = false;

            service.enableTracker(11, 22);

            expect(apiServiceMock.get).not.toHaveBeenCalled();

            userMock.triggerEvent(new UserLoginEvent());

            expect(apiServiceMock.get).toHaveBeenCalledWith('thirdpartytrackingcontent', { channelId: 11, productId: 22 });

            apiServiceMock.get.completeWith({ content: 'trackingContent' });

            expect(observableSpy).toHaveBeenCalledWith('trackingContent');

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
        });

        it('should retry the request 5 times with 10sec delay if there is an error then give up', () => {
            observableSpy.calls.reset();
            userMock.isAuthenticated = true;

            service.enableTracker(11, 22);

            for (let i = 1; i < 5; i++) {
                waitForAsync(() => {
                    apiServiceMock.get.error('err');

                    expect(observableSpy).not.toHaveBeenCalled();
                    expect(cookieServiceMock.putObject).toHaveBeenCalledWith('thirdPartyTracker', { channelId: 11, productId: 22, failureCount: i });
                });
            }

            waitForAsync(() => {
                apiServiceMock.get.error('err');

                expect(observableSpy).not.toHaveBeenCalled();
                expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
            });
        });

        it('should retry the request 5 times with 10sec delay if there is an error, then publish tracking content if there is one success', () => {
            observableSpy.calls.reset();
            userMock.isAuthenticated = true;

            service.enableTracker(11, 22);

            for (let i = 1; i < 5; i++) {
                waitForAsync(() => {
                    apiServiceMock.get.error('err');

                    expect(observableSpy).not.toHaveBeenCalled();
                    expect(cookieServiceMock.putObject).toHaveBeenCalledWith('thirdPartyTracker', { channelId: 11, productId: 22, failureCount: i });
                });
            }

            apiServiceMock.get.completeWith({ content: 'trackingContent' });

            expect(observableSpy).toHaveBeenCalledWith('trackingContent');

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
        });

        it('should not call api multiple times at once', () => {
            userMock.isAuthenticated = true;

            service.enableTracker(11, 22);
            service.enableTracker(11, 22);

            expect(apiServiceMock.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('init request from cookie', () => {
        function initService(failureCount?: number) {
            cookieServiceMock.getObject.withArgs('thirdPartyTracker').and.returnValue({ channelId: 11, productId: 22, failureCount });
            service = TestBed.inject(ThirdPartyTrackingService);

            service.trackingContent.subscribe(observableSpy);
        }

        it('should call api and publish tracking content if thirdPartyTracker cookie exists', () => {
            userMock.isAuthenticated = true;
            initService();

            expect(apiServiceMock.get).toHaveBeenCalledWith('thirdpartytrackingcontent', { channelId: 11, productId: 22 });

            apiServiceMock.get.completeWith({ content: 'trackingContent' });

            expect(observableSpy).toHaveBeenCalledWith('trackingContent');

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
        });

        it('should retry the request 5 times with 10sec delay if there is an error then give up starting with failure count from cookie', () => {
            userMock.isAuthenticated = true;
            initService(2);
            observableSpy.calls.reset();

            for (let i = 3; i < 5; i++) {
                waitForAsync(() => {
                    apiServiceMock.get.error('err');

                    expect(observableSpy).not.toHaveBeenCalled();
                    expect(cookieServiceMock.putObject).toHaveBeenCalledWith('thirdPartyTracker', { channelId: 11, productId: 22, failureCount: i });
                });
            }

            waitForAsync(() => {
                apiServiceMock.get.error('err');
                apiServiceMock.get.complete();

                expect(observableSpy).not.toHaveBeenCalled();
                expect(cookieServiceMock.remove).toHaveBeenCalledWith('thirdPartyTracker');
            });
        });
    });
});
