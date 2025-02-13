import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LastKnownProductServiceMock } from '../../../core/test/last-known-product/last-known-product.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { BalanceRefreshProcessor } from '../src/balance-refresh-processor';

describe('BalanceRefreshProcessor', () => {
    let service: BalanceRefreshProcessor;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;

    beforeEach(() => {
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        MockContext.useMock(LastKnownProductServiceMock);

        TestBed.configureTestingModule({
            providers: [BalanceRefreshProcessor, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(BalanceRefreshProcessor);
    });

    it('should process', () => {
        service.process();

        expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
    });
});
