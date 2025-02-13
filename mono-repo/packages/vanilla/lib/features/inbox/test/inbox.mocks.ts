import { Mock, Stub, StubObservable } from 'moxxi';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { CrappyInboxService } from '../src/services/crappy-inbox.service';
import { InboxCountService } from '../src/services/inbox-count.service';
import { InboxDataService } from '../src/services/inbox-data.service';
import { InboxResourceService } from '../src/services/inbox-resource.service';
import { InboxTrackingService } from '../src/services/inbox-tracking.service';
import { InboxMessage } from '../src/services/inbox.models';

@Mock({ of: CrappyInboxService })
export class CrappyInboxServiceMock {
    messages: BehaviorSubject<InboxMessage[]>;
    @Stub() resetMessages: jasmine.Spy;
    @StubObservable() getCasinoMobileGamesMetaData: jasmine.ObservableSpy;
    @StubObservable() remove: jasmine.ObservableSpy;
    @StubObservable() claimOffer: jasmine.ObservableSpy;
    @StubObservable() getEdsEventStatus: jasmine.ObservableSpy;
    @StubObservable() updateStatus: jasmine.ObservableSpy;
    @StubObservable() getMessages: jasmine.ObservableSpy;
}

@Mock({ of: InboxDataService })
export class InboxDataServiceMock {
    @StubObservable() getContent: jasmine.ObservableSpy;
}

@Mock({ of: InboxCountService })
export class InboxCountServiceMock {
    count = new ReplaySubject<number>(1);

    @Stub() refresh: jasmine.Spy;
}

@Mock({ of: InboxResourceService })
export class InboxResourceServiceMock {
    messages: BehaviorSubject<InboxMessage[]>;
    @StubObservable() getMessages: jasmine.ObservableSpy;
    @StubObservable() getMessagesCount: jasmine.ObservableSpy;
    @StubObservable() getMessage: jasmine.ObservableSpy;
    @StubObservable() removeMessages: jasmine.ObservableSpy;
    @StubObservable() updateStatus: jasmine.ObservableSpy;
    @StubObservable() getInboxMessagesInitData: jasmine.ObservableSpy;
    @StubObservable() getCasinoMobileGamesMetaData: jasmine.ObservableSpy;
    @StubObservable() getEdsEventStatus: jasmine.ObservableSpy;
    @StubObservable() claimOffer: jasmine.ObservableSpy;
}

@Mock({ of: InboxTrackingService })
export class InboxTrackingServiceMock {
    @StubObservable() trackInboxOpened: jasmine.PromiseSpy;
    @StubObservable() trackInboxClosedEarly: jasmine.PromiseSpy;
    @StubObservable() trackMessageOpened: jasmine.PromiseSpy;
    @StubObservable() trackMessageDeleted: jasmine.PromiseSpy;
    @StubObservable() trackCtaBonusClicked: jasmine.PromiseSpy;
    @StubObservable() trackCtaBonusSuccess: jasmine.PromiseSpy;
    @StubObservable() trackCtaPromoClicked: jasmine.PromiseSpy;
    @StubObservable() trackCtaPromoSuccess: jasmine.PromiseSpy;
    @StubObservable() trackCtaEdsClicked: jasmine.PromiseSpy;
    @StubObservable() trackCtaEdsSuccess: jasmine.PromiseSpy;
    @StubObservable() trackGameOpened: jasmine.PromiseSpy;
    @StubObservable() trackKycVerifyClicked: jasmine.PromiseSpy;
    @StubObservable() trackInboxClosed: jasmine.PromiseSpy;
    @StubObservable() reportError: jasmine.Spy;
}
