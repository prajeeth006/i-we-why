import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { UserEvent } from '../../src/user/user-events';
import { UserService } from '../../src/user/user.service';
import { ClaimsServiceMock } from './claims.mock';

@Mock({ of: UserService })
export class UserServiceMock extends UserService {
    constructor() {
        super();
        this.title = 'Mr';
        this.username = 'user';
        this.email = 'user@email.com';
        this.lang = 'en';
        this.isAuthenticated = true;
        this.claims = <any>new ClaimsServiceMock();
        this.workflowType = 0;
        this.userTimezoneUtcOffset = 240;
        this.events = new Subject();

        const triggerEvent = jasmine.createSpy('triggerEvent');
        triggerEvent.and.callFake((event: UserEvent) => {
            (<Subject<UserEvent>>this.events).next(event);
        });

        (<any>this).triggerEvent = triggerEvent;
    }
}
