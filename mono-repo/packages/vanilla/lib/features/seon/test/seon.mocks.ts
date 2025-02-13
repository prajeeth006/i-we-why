import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { SeonConfig } from '../src/seon.client-config';

@Mock({ of: SeonConfig })
export class SeonConfigMock extends SeonConfig {
    override whenReady = new Subject<void>();
    override enabled = true;
    override configParams = {
        silentMode: true,
        geolocation: {
            canPrompt: false,
        },
    };
}

export const seonSdkMock = {
    init: jasmine.createSpy('init'),
    getSession: jasmine.createSpy('getSession').and.returnValue(Promise.resolve('test-session-key')),
};
