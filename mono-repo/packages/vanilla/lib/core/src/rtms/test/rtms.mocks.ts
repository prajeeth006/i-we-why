import { RtmsMessage, ViewTemplateForClient } from '@frontend/vanilla/core';
import {
    NotificationMessage,
    NotificationMessageWithType,
    RtmsCommonService,
    RtmsLayerContentCacheManagerService,
    RtmsLayerMessagesStorageService,
    RtmsLayerNotificationQueue,
    RtmsMessageEx,
    RtmsSubscriberService,
} from '@frontend/vanilla/shared/rtms';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { RtmsLocalStoreService } from '../../../../shared/rtms/src/storage/low-level-storage/rtms-localstorage.service';
import { RtmsLayerStorageBase } from '../../../../shared/rtms/src/storage/low-level-storage/rtms-storage-base.model';
import { RtmsService } from '../rtms.service';

@Mock({ of: RtmsService })
export class RtmsServiceMock {
    messages: Subject<RtmsMessage> = new Subject<RtmsMessage>();
}

@Mock({ of: RtmsSubscriberService })
export class RtmsSubscriberServiceMock {
    @StubObservable() init: jasmine.ObservableSpy;
    messages: Subject<RtmsMessageEx> = new Subject<RtmsMessageEx>();
}

@Mock({ of: RtmsCommonService })
export class RtmsCommonServiceMock {
    @Stub() processMessage: jasmine.Spy;
    @Stub() nextMessage: jasmine.Spy;
    toasterList: NotificationMessage[] = [];
    webWorkerId: string;
    messageProcessedEvents: Subject<NotificationMessageWithType> = new Subject();
    errorMessageProcessedEvents: Subject<void> = new Subject();
    rtmsMessage: RtmsMessageEx;
    currentNotificationMessage: NotificationMessage;
    rtmsCommonContent: ViewTemplateForClient;
}

@Mock({ of: RtmsLayerStorageBase })
export class RtmsLayerStorageBaseMock {
    @Stub() set: jasmine.Spy;
    newMsObserver: any;
    @Stub() remove: jasmine.Spy;
    @StubObservable() get: jasmine.ObservableSpy;
}

@Mock({ of: RtmsLayerMessagesStorageService })
export class RtmsLayerMessagesStorageServiceMock {
    @StubObservable() getAll: jasmine.ObservableSpy;
    @Stub() set: jasmine.Spy;
    @Stub() delete: jasmine.Spy;
    @StubObservable() _getAll: jasmine.ObservableSpy;
    @Stub() _filterByUser: jasmine.Spy;
    @Stub() _hasSameRtmsMessage: jasmine.Spy;
}

@Mock({ of: RtmsLayerContentCacheManagerService })
export class RtmsLayerContentCacheManagerServiceMock {
    @StubObservable() getMessagesContent: jasmine.ObservableSpy;
    @Stub() sitecoreContent: jasmine.Spy;
}

@Mock({ of: RtmsLayerNotificationQueue })
export class RtmsLayerNotificationQueueMock {
    newMsObserver: Subject<RtmsMessageEx> = new Subject<RtmsMessageEx>();
    @Stub() dequeue: jasmine.Spy;
    @Stub() hasMessages: jasmine.Spy;
}

@Mock({ of: RtmsLocalStoreService })
export class RtmsLocalStoreServiceMock {
    @StubObservable() get: jasmine.ObservableSpy;
    @Stub() set: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
}
