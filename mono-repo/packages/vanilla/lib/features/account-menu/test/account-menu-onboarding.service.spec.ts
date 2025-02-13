import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { AccountMenuOnboardingService } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AccountMenuConfigMock } from './menu-content.mock';

describe('AccountMenuOnboardingService', () => {
    let service: AccountMenuOnboardingService;
    let menuContentMock: AccountMenuConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let userserviceMock: UserServiceMock;
    const now: Date = new Date();

    beforeEach(() => {
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        userserviceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuOnboardingService],
        });

        menuContentMock.account = <any>{
            version: 3,
            onboarding: { showPulseEffectLoginCount: 2, showHeaderHotspotLoginCount: 5, showAccountMenuHotspotLoginCount: 5 },
        };
        cookieServiceMock.get.withArgs('vn-olc').and.returnValue('1');
        cookieServiceMock.get.withArgs('vn-otslc').and.returnValue(undefined);
        cookieServiceMock.get.withArgs('vn-otd').and.returnValue('0');
        cookieServiceMock.get.withArgs('vn-login').and.returnValue('1');

        dateTimeServiceMock.now.and.returnValue(now);
        service = TestBed.inject(AccountMenuOnboardingService);
    });

    it('init should maintain cookie value', fakeAsync(() => {
        service.init(true);

        userserviceMock.triggerEvent(new UserLoginEvent());
        tick();
        expect(cookieServiceMock.put).toHaveBeenCalledWith('vn-olc', '2', { expires: now });
    }));

    it('init should maintain cookie value even if user logged in and login event not received due to any issue', () => {
        userserviceMock.isAuthenticated = true;
        cookieServiceMock.get.withArgs('vn-login').and.returnValue(undefined);
        service.init(true);
        expect(cookieServiceMock.put).toHaveBeenCalledWith('vn-olc', '2', { expires: now });
    });

    describe('headerComponentEnabled', () => {
        it('first login', () => {
            service.init(true);
            expect(service.isFirstLogin).toBeTrue();
        });

        it('second login', () => {
            cookieServiceMock.get.withArgs('vn-olc').and.returnValue('3');
            service.init(true);
            expect(service.isFirstLogin).toBeFalse();
        });

        it('sixt login', () => {
            cookieServiceMock.get.withArgs('vn-olc').and.returnValue('6');
            service.init(true);
            expect(service.isFirstLogin).toBeFalse();
        });

        it('should be false if tour is started', () => {
            cookieServiceMock.get.withArgs('vn-olc').and.returnValue('3');
            cookieServiceMock.get.withArgs('vn-otslc').and.returnValue('3');
            service.init(true);
            expect(service.isFirstLogin).toBeFalse();
        });
    });

    it('saveTourCompleted works', () => {
        service.saveTourCompleted();
        expect(cookieServiceMock.put).toHaveBeenCalledWith('vn-otc', '1', jasmine.anything());
    });
});
