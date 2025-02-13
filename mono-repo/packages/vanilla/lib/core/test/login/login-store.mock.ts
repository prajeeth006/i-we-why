import { LoginStoreService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: LoginStoreService })
export class LoginStoreServiceMock {
    LastVisitor: string;
    LastAttemptedVisitor: string;
    LoginType: string;
    PostLoginValues: any;
    ReturnUrlFromLogin: any;
    PendingActions: any;
    SelectedTab: string;
    PostLoginCcbEventDelayEnabled: boolean;
    @Stub() enablePostLoginCcbDelay: jasmine.Spy;
    @Stub() disablePostLoginCcbDelay: jasmine.Spy;
}
