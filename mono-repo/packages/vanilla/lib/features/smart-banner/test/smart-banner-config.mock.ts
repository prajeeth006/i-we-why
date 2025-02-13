import { MenuContentItem } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { SmartBannerConfig } from '../src/smart-banner.client-config';

@Mock({ of: SmartBannerConfig })
export class SmartBannerConfigMock extends SmartBannerConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.appId = '123456';
        this.displayCounter = 2;
        this.minimumRating = 4;
        this.apiForDataSource = 'PosApi';
        this.appInfo = {
            url: 'https://bwin.com',
        } as MenuContentItem;
    }
}
