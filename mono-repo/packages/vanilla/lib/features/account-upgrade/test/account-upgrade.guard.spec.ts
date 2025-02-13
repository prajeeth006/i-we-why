import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountUpgradeGuard } from '@frontend/vanilla/features/account-upgrade';
import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { AccountUpgradeConfigMock } from './account-upgrade.mocks';

describe('AccountUpgradeGuard', () => {
    let accountUpgradeConfigMock: AccountUpgradeConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        accountUpgradeConfigMock = MockContext.useMock(AccountUpgradeConfigMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
        spy = jasmine.createSpy();
    });

    function runGuard(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return TestBed.runInInjectionContext(() => {
            return AccountUpgradeGuard(_route, state);
        });
    }

    describe('canActivate', () => {
        it('should return true if user doesnt have correct claim value', fakeAsync(() => {
            claimsServiceMock.get.withArgs('accbusinessphase').and.returnValue('bla');

            runGuard(<any>null, <any>null).then(spy);
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return true if current url is allowed', fakeAsync(() => {
            accountUpgradeConfigMock.allowedUrls = ['play/bla'];

            runGuard(<any>null, <any>{ url: 'play/bla', root: null }).then(spy);
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return false', fakeAsync(() => {
            claimsServiceMock.get.withArgs('accbusinessphase').and.returnValue('in-shop');
            accountUpgradeConfigMock.allowedUrls = [];
            accountUpgradeConfigMock.redirectUrl = 'play/redirect';

            runGuard(<any>null, <any>{ url: 'play/bla', root: null }).then(spy);
            accountUpgradeConfigMock.whenReady.next();
            tick();

            expect(spy).toHaveBeenCalledWith(false);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(accountUpgradeConfigMock.redirectUrl, { appendReferrer: 'play/bla' });
        }));
    });
});
