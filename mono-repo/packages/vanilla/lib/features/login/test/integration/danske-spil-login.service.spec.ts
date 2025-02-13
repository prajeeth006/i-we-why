import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../../core/src/http/test/shared-features-api.mock';
import { DanskeSpilLoginService } from '../../src/integration/danske-spil-login.service';
import { LoginIntegrationConfigMock } from '../login.mocks';

describe('DanskeSpilLoginService', () => {
    let service: DanskeSpilLoginService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let loginIntegrationConfigMock: LoginIntegrationConfigMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        loginIntegrationConfigMock = MockContext.useMock(LoginIntegrationConfigMock);

        TestBed.configureTestingModule({
            providers: [DanskeSpilLoginService, MockContext.providers],
        });
    });
    beforeEach(() => {
        loginIntegrationConfigMock.options = <any>{};
        service = TestBed.inject(DanskeSpilLoginService);
    });

    describe('isSessionActive()', () => {
        it('should be active', () => {
            const spy = jasmine.createSpy();

            service.isSessionActive().subscribe(spy);
            loginIntegrationConfigMock.whenReady.next();

            apiServiceMock.jsonp.completeWith(JSON.stringify({ isSessionActive: 'true' }));

            expect(spy).toHaveBeenCalledWith(true);
        });
    });

    describe('getLoginParameters()', () => {
        it('should return params', () => {
            const spy = jasmine.createSpy();

            service.getLoginParameters().subscribe(spy);
            loginIntegrationConfigMock.whenReady.next();

            apiServiceMock.jsonp.completeWith({ loginId: 'loginId', assertionId: 'assertionId' });

            expect(spy).toHaveBeenCalledWith({ username: 'loginId', password: 'assertionId' });
        });
    });

    describe('logout()', () => {
        it('should logout', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.logout().then(spy);
            loginIntegrationConfigMock.whenReady.next();
            apiServiceMock.jsonp.completeWith(JSON.stringify({ logoutSuccess: 'true' }));
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));
    });
});
