import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AppInfoConfigMock } from '../../src/client-config/test/app-info-config.mock';
import { RtmsConfigService } from '../../src/rtms/rtms-config.service';
import { CookieServiceMock } from '../browser/cookie.mock';
import { ClaimsServiceMock } from '../user/claims.mock';
import { UserServiceMock } from '../user/user.mock';

describe('RtmsConfigService', () => {
    let service: RtmsConfigService;
    let userMock: UserServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let claimsServiceMock: ClaimsServiceMock;

    beforeEach(() => {
        MockContext.useMock(AppInfoConfigMock);
        userMock = MockContext.useMock(UserServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        userMock.claims = <any>claimsServiceMock;

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsConfigService],
        });

        cookieServiceMock.get.withArgs('trackerId').and.returnValue('tracker');

        service = TestBed.inject(RtmsConfigService);
    });

    it('should return rtms parameters', () => {
        userMock.isAuthenticated = false;

        const config = service.params();

        expect(config).toEqual({
            brand: 'PARTY',
            frontend: 'PP',
            product: 'POKER',
            channel: 'WC',
            trackerId: 'tracker',
        });
    });

    it('should return rtms parameters with user data for authenticated users', () => {
        userMock.ssoToken = 'sso';
        userMock.country = 'DE';
        userMock.loyalty = 'B';
        userMock.id = 'id';
        claimsServiceMock.get.withArgs('tierCode').and.returnValue('T');
        claimsServiceMock.get.withArgs('vipLevel').and.returnValue('V');

        const config = service.params();

        expect(config).toEqual({
            brand: 'PARTY',
            frontend: 'PP',
            product: 'POKER',
            channel: 'WC',
            trackerId: 'tracker',
            user: 'id',
            sso: 'sso',
            country: 'DE',
            loyaltyCategory: 'B',
            tierCode: 'T',
            vipLevel: 'V',
        });
    });
});
