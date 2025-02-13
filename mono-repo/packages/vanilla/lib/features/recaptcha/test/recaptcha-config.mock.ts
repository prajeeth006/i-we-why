import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ReCaptchaConfig } from '../src/recaptcha.client-config';

@Mock({ of: ReCaptchaConfig })
export class ReCaptchaConfigMock {
    whenReady = new Subject<void>();

    areas = { login: true };
    siteKey = 'xxx666';
    v3SiteKey = 'xxx666v3';
    invisibleSiteKey = 'xxx666invis';
    enterpriseSiteKey = 'xxx666enterprise';
    badge = 'inline';
    theme = 'rose-gold';
    type = 'turing-test';
    size = 'extra-big';
    verificationMessage = 'Solve the captcha please!';
    instrumentationOnPageLoad = false;
}
