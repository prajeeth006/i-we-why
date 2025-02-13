import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { quickDepositGuard } from '../src/quick-deposit/quick-deposit.guard';
import { CashierConfigMock, QuickDepositServiceMock } from './cashier.mock';

describe('QuickDepositGuard', () => {
    let quickDepositServiceMock: QuickDepositServiceMock;
    let config: CashierConfigMock;
    beforeEach(() => {
        quickDepositServiceMock = MockContext.useMock(QuickDepositServiceMock);
        config = MockContext.useMock(CashierConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
    });

    function runGuard(route: ActivatedRouteSnapshot) {
        return TestBed.runInInjectionContext(() => {
            return quickDepositGuard(route);
        });
    }

    describe('canActivate', () => {
        it('should return true if guard url is in allowedUrls', fakeAsync(() => {
            quickDepositServiceMock.isEnabled.and.returnValue(of(true));
            runGuard(<any>{ params: { action: 'deposit' } }).then((enabled) => {
                config.whenReady.next();
                expect(quickDepositServiceMock.open).toHaveBeenCalledWith({ showKYCVerifiedMessage: false });
                expect(enabled).toBeFalse();
            });
        }));

        it('should return false if password validation is required', fakeAsync(() => {
            quickDepositServiceMock.isEnabled.and.returnValue(of(false));
            runGuard(<any>{ params: { action: 'withro' } }).then((enabled) => {
                config.whenReady.next();
                expect(enabled).toBeTrue();
            });
        }));
    });
});
