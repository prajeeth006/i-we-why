import { Mock } from 'moxxi';

import { BadgeConfig } from '../src/badge.client-config';

@Mock({ of: BadgeConfig })
export class BadgeConfigMock {
    cssClass: string = 'badge-default';
}
