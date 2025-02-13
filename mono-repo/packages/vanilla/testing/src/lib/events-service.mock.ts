import { signal } from '@angular/core';

import { EventsService, SimpleEvent } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export const EventsServiceMock = () =>
    MockService(EventsService, {
        event: signal<SimpleEvent | null>(null),
        events: new BehaviorSubject<SimpleEvent>({
            eventName: 'test',
            data: {},
        }) as Observable<SimpleEvent>,
        allEvents: new Subject<SimpleEvent>(),
        newEvents: new Subject<SimpleEvent>(),
        raise: jest.fn(),
    });

export const EventsServiceProviderMock = () => MockProvider(EventsService, EventsServiceMock());
