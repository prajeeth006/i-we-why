import { TestBed, fakeAsync } from '@angular/core/testing';

import { QuickDepositAction } from '@frontend/vanilla/features/cashier';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { QuickDepositService } from '../src/quick-deposit/quick-deposit.service';
import { CashierConfigMock, CashierResourceServiceMock } from './cashier.mock';

describe('QuickDepositService', () => {
    let service: QuickDepositService;
    let cashierConfig: CashierConfigMock;
    let userServiceMock: UserServiceMock;
    let cashierResourceServiceMock: CashierResourceServiceMock;

    beforeEach(() => {
        cashierConfig = MockContext.useMock(CashierConfigMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        cashierResourceServiceMock = MockContext.useMock(CashierResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, QuickDepositService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(QuickDepositService);
    });

    it('open should work', () => {
        spyOn(service.events, 'next');

        service.open({});

        expect(service.events.next).toHaveBeenCalledWith({ action: QuickDepositAction.Open, options: {} });
    });

    it('open should work with showMessage parameter', () => {
        spyOn(service.events, 'next');

        service.open({ showKYCVerifiedMessage: true });

        expect(service.events.next).toHaveBeenCalledWith({ action: QuickDepositAction.Open, options: { showKYCVerifiedMessage: true } });
    });

    it('isEnabled should work', fakeAsync(() => {
        cashierConfig.isQuickDepositEnabled = true;
        userServiceMock.isAuthenticated = true;

        service.isEnabled().subscribe((enabled: boolean) => {
            expect(enabled).toBeTrue();
        });
        cashierResourceServiceMock.quickDepositEnabled.completeWith(true);
    }));

    it('isEnabled should be false when authenticated', () => {
        cashierConfig.isQuickDepositEnabled = false;
        service.isEnabled().subscribe((enabled: boolean) => {
            expect(enabled).toBeFalse();
        });
    });

    it('isEnabled should be false when unauthenticated', () => {
        cashierConfig.isQuickDepositEnabled = true;
        userServiceMock.isAuthenticated = false;
        service.isEnabled().subscribe((enabled: boolean) => {
            expect(enabled).toBeFalse();
        });
    });

    it('isEnabled should not work', () => {
        cashierConfig.isQuickDepositEnabled = true;
        userServiceMock.isAuthenticated = true;
        service.isEnabled().subscribe((enabled: boolean) => {
            expect(enabled).toBeFalse();
        });
        cashierResourceServiceMock.quickDepositEnabled.completeWith(false);
    });
});
