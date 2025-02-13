import { TestBed } from '@angular/core/testing';

import { BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';
import { cloneDeep } from 'lodash-es';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { BonusBalanceResponse } from '../src/bonus-balance.models';

describe('BonusBalanceService', () => {
    let service: BonusBalanceService;
    let apiService: SharedFeaturesApiServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let spy: jasmine.Spy;
    let bonusBalanceResponse: BonusBalanceResponse;

    beforeEach(() => {
        apiService = MockContext.useMock(SharedFeaturesApiServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BonusBalanceService],
        });

        service = TestBed.inject(BonusBalanceService);
        spy = jasmine.createSpy();

        bonusBalanceResponse = {
            bingo: {
                bonuses: [{ bonusAmount: 12.0, isBonusActive: true, applicableProducts: ['BINGO'] }],
            },
            poker: {
                bonuses: [{ bonusAmount: 18.0, isBonusActive: true, applicableProducts: ['POKER'] }],
            },
            multi: {
                bonuses: [
                    { bonusAmount: 9.0, isBonusActive: true, applicableProducts: ['CASINO', 'BINGO'] },
                    { bonusAmount: 9.0, isBonusActive: true, applicableProducts: ['CASINO', 'POKER'] },
                ],
            },
            sportsbetting: {
                bonuses: [{ bonusAmount: 1.0, isBonusActive: false, applicableProducts: ['SPORTSBETTING'] }],
            },
        };
    });

    describe('bonusBalance', () => {
        it('should return current balance to subscribers which is fetched only after calling refresh', () => {
            service.bonusBalance.subscribe(spy);
            service.refresh();

            resolveApi();

            expect(spy).toHaveBeenCalledWith({ CASINO: 18, POKER: 27, BINGO: 21, SPORTSBETTING_inactive: 1 });
        });
    });

    it('should not refresh bonus balance when balance if already in progress', () => {
        service.bonusBalance.subscribe(spy);
        service.refresh();
        service.refresh();

        expect(apiService.get).toHaveBeenCalledTimes(1);

        resolveApi();

        apiService.get.calls.reset();
        service.refresh();

        expect(apiService.get).toHaveBeenCalledTimes(1);
    });

    describe('refresh on balance change', () => {
        it('should refresh bonus balance when balance is refreshed', () => {
            service.bonusBalance.subscribe(spy);
            service.refresh();
            resolveApi();

            apiService.get.calls.reset();

            balancePropertiesServiceMock.balanceProperties.next(<any>{ propagateRefresh: true });

            expect(apiService.get).toHaveBeenCalledTimes(1);

            bonusBalanceResponse['bingo']!.bonuses[0]!.bonusAmount = 11;

            resolveApi();

            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ BINGO: 20 }));
        });

        it('should refresh bonus balance and third party balance if enabled when balance is refreshed', () => {
            service.bonusBalance.subscribe(spy);
            service.refresh();
            resolveApi();

            apiService.get.calls.reset();

            balancePropertiesServiceMock.balanceProperties.next(<any>{ propagateRefresh: true });

            expect(apiService.get).toHaveBeenCalledTimes(1);

            bonusBalanceResponse['bingo']!.bonuses[0]!.bonusAmount = 11;

            resolveApi();

            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ BINGO: 20 }));
        });
    });

    function resolveApi() {
        expect(apiService.get).toHaveBeenCalledWith('balance/bonus');
        apiService.get.completeWith(cloneDeep(bonusBalanceResponse));
    }
});
