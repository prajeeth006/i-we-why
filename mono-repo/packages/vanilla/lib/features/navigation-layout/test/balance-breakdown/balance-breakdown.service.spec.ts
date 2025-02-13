import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { BalanceBreakdownService } from '../../../balance-breakdown/src/balance-breakdown.service';

class DummyComponent {}

describe('BalanceBreakdownService', () => {
    let service: BalanceBreakdownService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers, BalanceBreakdownService],
        });

        service = TestBed.inject(BalanceBreakdownService);
    });

    describe('Balance breakdown templates', () => {
        it('should allow to set balance breakdown templates', () => {
            service.setBalanceBreakdownComponent('type', DummyComponent);

            expect(service.getBalanceBreakdownComponent('type')).toBe(DummyComponent);
        });
    });
});
