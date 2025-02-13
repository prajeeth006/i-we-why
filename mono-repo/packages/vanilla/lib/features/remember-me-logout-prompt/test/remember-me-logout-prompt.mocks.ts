import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { RememberMeLogoutPromptConfig } from '../src/remember-me-logout-prompt.client-config';

@Mock({ of: RememberMeLogoutPromptConfig })
export class RememberMeLogoutPromptConfigMock extends RememberMeLogoutPromptConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();
        this.content = {
            text: 'Hi __claimGreetingProperty__',
            messages: {
                claimGreetingProperty: 'givenname',
                rememberme: 'Remember me and close',
                close: 'close',
            },
        };
    }
}
