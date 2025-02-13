import { Mock } from 'moxxi';

import { AppInfoConfig } from '../app-info.client-config';

@Mock({ of: AppInfoConfig })
export class AppInfoConfigMock extends AppInfoConfig {
    constructor() {
        super();
        this.brand = 'PARTY';
        this.frontend = 'PP';
        this.product = 'POKER';
        this.channel = 'WC';
    }
}
