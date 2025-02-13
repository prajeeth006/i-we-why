import { ClaimsService, SimpleEvent, UserService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';
import { Observable, Subject } from 'rxjs';

export const UserServiceMock = () =>
    MockService(UserService, {
        title: 'Mr',
        username: 'user',
        email: 'user@email.com',
        lang: 'en',
        isAuthenticated: true,
        claims: MockService(ClaimsService),
        workflowType: 0,
        userTimezoneUtcOffset: 240,
        events: new Subject() as Observable<SimpleEvent>,
        triggerEvent: jest.fn().mockImplementation(function (this: UserService, event: SimpleEvent) {
            (this.events as Subject<SimpleEvent>).next(event);
        }),
    });

export const UserServiceProvider = () => MockProvider(UserService, UserServiceMock());
