import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RtmsMessage } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { SessionInfoBootstrapService } from '../src/session-info-bootstrap.service';
import { SessionInfoConfigMock } from './session-info-config.mock';
import { SessionInfoServiceMock } from './session-info.mock';

describe('SessionInfoBootstrapService', () => {
    let service: SessionInfoBootstrapService;
    let sessionInfoServiceMock: SessionInfoServiceMock;
    let rtmsServiceMock: RtmsServiceMock;
    let sessionInfoConfigMock: SessionInfoConfigMock;

    beforeEach(() => {
        sessionInfoServiceMock = MockContext.useMock(SessionInfoServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        sessionInfoConfigMock = MockContext.useMock(SessionInfoConfigMock);

        TestBed.configureTestingModule({
            providers: [SessionInfoBootstrapService, MockContext.providers],
        });
        service = TestBed.inject(SessionInfoBootstrapService);
    });

    describe('onFeatureInit()', () => {
        describe('RTMS message RCPU_SESS_EXPIRY_EVENT', () => {
            it('should show overlay when rtms message is received', fakeAsync(() => {
                const rtmsTestMessage: RtmsMessage = {
                    type: 'RCPU_SESS_EXPIRY_EVENT',
                    eventId: '123',
                    payload: { balance: '10.36', elapsedTime: '63200' },
                };
                service.onFeatureInit();
                sessionInfoConfigMock.whenReady.next();

                tick();
                rtmsServiceMock.messages.next(rtmsTestMessage);

                expect(sessionInfoServiceMock.processMessage).toHaveBeenCalledWith(rtmsTestMessage.type, rtmsTestMessage.payload);
                expect(sessionInfoServiceMock.checkStatus).toHaveBeenCalled();
            }));
        });

        describe('RTMS message RCPU_ACTION_ACK', () => {
            it('should close overlay when rtms message with rcpuAction = CONTINUE', fakeAsync(() => {
                const rtmsTestMessage: any = {
                    type: 'RCPU_ACTION_ACK',
                    eventId: '123',
                    payload: { rcpuAction: 'CONTINUE' },
                };
                service.onFeatureInit();
                sessionInfoConfigMock.whenReady.next();
                tick();

                rtmsServiceMock.messages.next(rtmsTestMessage);

                expect(sessionInfoServiceMock.processMessage).toHaveBeenCalledWith(rtmsTestMessage.type, rtmsTestMessage.payload);
            }));
        });
    });
});
