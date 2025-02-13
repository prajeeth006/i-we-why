import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BalanceProperties } from '@frontend/vanilla/core';
import { BalancePropertiesService, BalanceTransfer, BalanceType } from '@frontend/vanilla/features/balance-properties';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BalanceSettingsConfigMock } from '../../bonus-balance/test/balance-settings-config.mock';

describe('BalancePropertiesService', () => {
    let service: BalancePropertiesService;
    let userMock: UserServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let balanceSettingsConfigMock: BalanceSettingsConfigMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        balanceSettingsConfigMock = MockContext.useMock(BalanceSettingsConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BalancePropertiesService],
        });

        service = TestBed.inject(BalancePropertiesService);
        spy = jasmine.createSpy();
    });

    describe('update', () => {
        it('should update balance', () => {
            service.balanceProperties.subscribe(spy);

            service.update(<BalanceProperties>{ accountBalance: 55 });

            expect(spy).toHaveBeenCalledWith({ accountBalance: 55 });
        });
    });

    describe('transfer', () => {
        it('should call transfer API', () => {
            const balanceTransfer: BalanceTransfer = { amount: 100, fromBalanceType: BalanceType.MainRealBal, toBalanceType: BalanceType.PayPalBal };
            service.transfer(balanceTransfer);

            expect(apiServiceMock.post).toHaveBeenCalledOnceWith('balance/transfer', balanceTransfer);
        });
    });

    describe('refresh', () => {
        it('should call balance refresh API', fakeAsync(() => {
            const balance = <BalanceProperties>{ accountBalance: 100, propagateRefresh: true };

            service.balanceProperties.subscribe(spy);
            service.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledOnceWith('balance', undefined, { showSpinner: false });

            apiServiceMock.get.completeWith({ balance });
            tick();

            expect(spy).toHaveBeenCalledWith(balance);
        }));

        it('should NOT call balance refresh API for unauthenticated users', () => {
            userMock.isAuthenticated = false;

            service.refresh();

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });
    });

    describe('isLow', () => {
        beforeEach(() => {
            userMock.currency = 'USD';

            balanceSettingsConfigMock.lowThresholds = {
                '*': 10,
                'EUR': 5,
            };
        });

        it('should return true if balance of specified currency is low', () => {
            userMock.isAuthenticated = true;
            userMock.currency = 'EUR';

            expect(service.isLow(4)).toBeTrue();
            expect(service.isLow(6)).toBeFalse();
        });

        it('should return true if balance of fallback currency is low', () => {
            userMock.isAuthenticated = true;

            expect(service.isLow(9)).toBeTrue();
            expect(service.isLow(11)).toBeFalse();
        });

        it('should return false if low threshold is not specified', () => {
            userMock.isAuthenticated = true;
            balanceSettingsConfigMock.lowThresholds = {};

            expect(service.isLow(1)).toBeFalse();
        });
    });
});
