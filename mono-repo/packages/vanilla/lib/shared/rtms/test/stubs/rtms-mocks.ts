import { RtmsMessage, RtmsService } from '@frontend/vanilla/core';
import {
    RtmsLayerConfig,
    RtmsLayerContentCacheManagerService,
    RtmsLayerMessagesStorageService,
    RtmsLayerNotificationQueue,
    RtmsMessageEx,
    RtmsSubscriberService,
} from '@frontend/vanilla/shared/rtms';
import { Mock, Stub, StubObservable } from 'moxxi';
import { Subject } from 'rxjs';

import { RtmsLayerStorageBase } from '../../src/storage/low-level-storage/rtms-storage-base.model';

@Mock({ of: RtmsLayerConfig })
export class RtmsClientConfigMock {
    whenReady = new Subject<void>();
    isMicroComponentEnabled: boolean;
    showCloseButtonOnBonusTeaser: boolean = true;
    bonusTeaserRedirectUrl: string = '{culture}/test';
    enableToastStacking: boolean;
    version: number;
    toastShowTime = 1;
}

@Mock({ of: RtmsService })
export class RtmsServiceMock {
    messages: Subject<RtmsMessage> = new Subject<RtmsMessage>();
}

@Mock({ of: RtmsSubscriberService })
export class RtmsSubscriberServiceMock {
    @StubObservable() init: jasmine.ObservableSpy;
    messages: Subject<RtmsMessageEx> = new Subject<RtmsMessageEx>();
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
