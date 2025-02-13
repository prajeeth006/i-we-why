import { RtmsMessage, RtmsService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';
import { Subject } from 'rxjs';

export const RtmsServiceMock = () =>
    MockService(RtmsService, {
        messages: new Subject<RtmsMessage>(),
    });

export const RtmsServiceProviderMock = () => MockProvider(RtmsService, RtmsServiceMock());
