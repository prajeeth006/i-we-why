import { UserEvent, UserService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';
import { Subject } from 'rxjs';

export const UserServiceMock = MockService(UserService, {
    events: new Subject<UserEvent>(),
    triggerEvent: jest.fn().mockImplementation((event: UserEvent) => (UserServiceMock.events as Subject<UserEvent>).next(event)),
});
