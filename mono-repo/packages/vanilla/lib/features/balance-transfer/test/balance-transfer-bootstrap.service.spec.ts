import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { BalanceTransferBootstrapService } from '../src/balance-transfer-bootstrap.service';
import { BalanceTransferServiceMock } from './balance-transfer.mock';

describe('BalanceTransferBootstrapService', () => {
    let service: BalanceTransferBootstrapService;
    let balanceTransferServiceMock: BalanceTransferServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        balanceTransferServiceMock = MockContext.useMock(BalanceTransferServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BalanceTransferBootstrapService],
        });

        service = TestBed.inject(BalanceTransferBootstrapService);
    });

    it('should show overlay when event comes', () => {
        service.onFeatureInit();

        nativeAppServiceMock.eventsFromNative.next({ eventName: 'BALANCE_TRANSFER', parameters: {} });

        expect(balanceTransferServiceMock.show).toHaveBeenCalled();
    });
});
