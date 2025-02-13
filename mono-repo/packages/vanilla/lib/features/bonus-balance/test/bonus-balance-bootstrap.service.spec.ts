import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { BonusBalanceBootstrapService } from '../src/bonus-balance-bootstrap.service';
import { BonusBalanceServiceMock } from './bonus-balance.mock';

describe('BonusBalanceBootstrapService', () => {
    let service: BonusBalanceBootstrapService;
    let bonusBalanceServiceMock: BonusBalanceServiceMock;

    beforeEach(() => {
        bonusBalanceServiceMock = MockContext.useMock(BonusBalanceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BonusBalanceBootstrapService],
        });

        service = TestBed.inject(BonusBalanceBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should refresh bonus balance', () => {
            service.onFeatureInit();

            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalled();
        });
    });
});
