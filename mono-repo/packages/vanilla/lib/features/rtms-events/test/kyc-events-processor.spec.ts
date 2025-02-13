import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType, RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LastKnownProductServiceMock } from '../../../core/test/last-known-product/last-known-product.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { CashierServiceMock } from '../../cashier/test/cashier.mock';
import { KycStatusServiceMock } from '../../kyc/test/kyc.mocks';
import { KycEventsProcessor } from '../src/kyc-events-processor';
import { RtmsEventsConfigMock } from './rtms-events.mocks';

describe('KycEventsProcessor', () => {
    let service: KycEventsProcessor;
    let userMock: UserServiceMock;
    let cashierServiceMock: CashierServiceMock;
    let configMock: RtmsEventsConfigMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        cashierServiceMock = MockContext.useMock(CashierServiceMock);
        configMock = MockContext.useMock(RtmsEventsConfigMock);
        MockContext.useMock(LastKnownProductServiceMock);
        MockContext.useMock(KycStatusServiceMock);

        TestBed.configureTestingModule({
            providers: [KycEventsProcessor, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(KycEventsProcessor);
    });

    it('should do nothing when Kyc verified message is received and redirect is disabled', fakeAsync(() => {
        userMock.realPlayer = false;
        configMock.isCashierRedirectEnabled = false;
        configMock.whenReady.next();
        tick();
        service.process({ name: RtmsType.KYC_VERIFIED_EVENT, type: EventType.Rtms, data: {} });

        expect(cashierServiceMock.goToCashierDeposit).not.toHaveBeenCalled();
    }));

    it('should do nothing when Kyc verified message is received and user is real player', fakeAsync(() => {
        userMock.realPlayer = true;
        configMock.isCashierRedirectEnabled = false;
        configMock.whenReady.next();
        tick();
        service.process({ name: RtmsType.KYC_VERIFIED_EVENT, type: EventType.Rtms, data: {} });

        expect(cashierServiceMock.goToCashierDeposit).not.toHaveBeenCalled();
    }));
});
