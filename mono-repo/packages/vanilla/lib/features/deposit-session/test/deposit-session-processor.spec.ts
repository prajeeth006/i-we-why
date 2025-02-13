import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventContext, EventType, NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DepositSessionProcessor } from '../src/deposit-session-processor';
import { DepositSessionEvent } from '../src/deposit-session.models';
import { DepositSessionConfigMock, DepositSessionOverlayServiceMock } from './deposit-session.mocks';

describe('DepositSessionProcessor', () => {
    let service: DepositSessionProcessor;
    let depositSessionConfigMock: DepositSessionConfigMock;
    let depositSessionOverlayServiceMock: DepositSessionOverlayServiceMock;

    beforeEach(() => {
        depositSessionConfigMock = MockContext.useMock(DepositSessionConfigMock);
        depositSessionOverlayServiceMock = MockContext.useMock(DepositSessionOverlayServiceMock);

        TestBed.configureTestingModule({
            providers: [DepositSessionProcessor, MockContext.providers],
        });

        service = TestBed.inject(DepositSessionProcessor);
    });

    it('should process', fakeAsync(() => {
        const depositSessionEvent: EventContext<DepositSessionEvent> = {
            type: EventType.Native,
            name: NativeEventType.LARGE_CASH_INSERT,
            data: {
                cumulativeAmount: 100,
                currency: 'USD',
            },
        };

        service.process(depositSessionEvent);
        depositSessionConfigMock.whenReady.next();
        tick();

        expect(depositSessionOverlayServiceMock.show).toHaveBeenCalledOnceWith(depositSessionEvent.data);
    }));
});
