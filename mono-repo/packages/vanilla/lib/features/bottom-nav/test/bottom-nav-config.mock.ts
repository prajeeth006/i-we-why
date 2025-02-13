import { MenuContentItem } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { BottomNavConfig } from '../src/bottom-nav.client-config';

@Mock({ of: BottomNavConfig })
export class BottomNavConfigMock extends BottomNavConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.items = <MenuContentItem[]>[
            {
                text: '<p>Link1</p>',
                class: 'theme-b',
            },
            {
                url: 'http://help.bwin.dev/en/general-information/legal-matters/general-terms-and-conditions',
                text: 'Link 2',
                target: 'help',
                class: 'theme-a',
            },
        ];
    }
}
