import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { CookieConsentConfig } from '../src/cookie-consent.client-config';

@Mock({ of: CookieConsentConfig })
export class CookieConsentConfigMock extends CookieConsentConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();

        this.content = {
            text: 'cookie consent',
            messages: {},
        };
    }
}
