import { CookieOptions } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';

import { CookieOptionsProvider } from '../../../core/src/browser/cookie/cookie-options-provider';

@Mock({ of: CookieOptionsProvider })
export class CookieOptionsProviderMock {
    options: CookieOptions;
}
