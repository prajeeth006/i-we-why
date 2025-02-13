import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { RtmsCommonService } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { RtmsClientConfigMock, RtmsLayerContentCacheManagerServiceMock, RtmsLayerNotificationQueueMock } from './stubs/rtms-mocks';

describe('RtmsCommonService', () => {
    let service: RtmsCommonService;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let rtmsLayerNotificationQueueMock: RtmsLayerNotificationQueueMock;
    let rtmsLayerContentCacheManagerServiceMock: RtmsLayerContentCacheManagerServiceMock;
    let userServiceMock: UserServiceMock;
    let rtmsClientConfigMock: RtmsClientConfigMock;

    beforeEach(() => {
        rtmsLayerNotificationQueueMock = MockContext.useMock(RtmsLayerNotificationQueueMock);
        rtmsLayerContentCacheManagerServiceMock = MockContext.useMock(RtmsLayerContentCacheManagerServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        rtmsClientConfigMock = MockContext.useMock(RtmsClientConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsCommonService],
        });

        service = TestBed.inject(RtmsCommonService);
    });

    describe('processMessage', () => {
        beforeEach(() => {
            service.fetchingMessageContent = false;
            userServiceMock.isAuthenticated = true;
            rtmsLayerNotificationQueueMock.hasMessages.and.returnValue(true);
        });

        it('should not get messages if currently fetchingMessageContent', () => {
            service.fetchingMessageContent = true;

            service.processMessage();

            expect(rtmsLayerContentCacheManagerServiceMock.getMessagesContent).not.toHaveBeenCalled();
        });

        it('should not get messages if user not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            service.processMessage();

            expect(rtmsLayerContentCacheManagerServiceMock.getMessagesContent).not.toHaveBeenCalled();
        });

        it('should not get messages if queue does not have messages', () => {
            rtmsLayerNotificationQueueMock.hasMessages.and.returnValue(false);

            service.processMessage();

            expect(rtmsLayerContentCacheManagerServiceMock.getMessagesContent).not.toHaveBeenCalled();
        });
    });

    describe('nextMessage', () => {
        it('should process message when messages in queue', fakeAsync(() => {
            service.webWorkerId = '1';
            spyOn(service, 'processMessage');

            service.nextMessage();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(service.webWorkerId);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.RtmsLayerTimeout,
                {
                    timeout: rtmsClientConfigMock.toastShowTime * 1000,
                },
                jasmine.any(Function),
            );

            tick(1000);

            expect(service.processMessage).toHaveBeenCalled();
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.RtmsLayerTimeout);
        }));
    });
});
