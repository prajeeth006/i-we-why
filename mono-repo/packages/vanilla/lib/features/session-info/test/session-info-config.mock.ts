import { MenuContentItem } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { SessionInfoConfig } from '../src/session-info.client-config';

@Mock({ of: SessionInfoConfig })
export class SessionInfoConfigMock {
    whenReady = new Subject<void>();
    urlBlacklist: string[] = [];
    showWinningsLosses: boolean = true;
    showTotalWager: boolean = true;
    content: MenuContentItem = {
        resources: <any>{
            LoginDuration: '{LOGIN_DURATION}',
            WinningsLosses: '{WINNINGS_LOSSES}',
            TotalWager: '{TOTAL_WAGER}',
            Hours: 'hours',
        },
        image: {
            src: 'https://test.url',
        },
    } as MenuContentItem;
}
