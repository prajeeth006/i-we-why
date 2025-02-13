import { signal } from '@angular/core';

import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { EventsService, SimpleEvent } from '../events.service';
import { UtilsService } from '../utils.service';

@Mock({ of: UtilsService })
export class UtilsServiceMock {
    @Stub() generateGuid: jasmine.Spy;
    @Stub() format: jasmine.Spy;
    @Stub() isEmail: jasmine.Spy;
}

@Mock({ of: EventsService })
export class EventsServiceMock {
    event = signal<SimpleEvent | null>(null);
    events: BehaviorSubject<SimpleEvent | null> = new BehaviorSubject<SimpleEvent | null>(null);
    allEvents: Subject<SimpleEvent> = new Subject<SimpleEvent>();
    newEvents: Subject<SimpleEvent> = new Subject<SimpleEvent>();

    @Stub() raise: jasmine.Spy;
}
