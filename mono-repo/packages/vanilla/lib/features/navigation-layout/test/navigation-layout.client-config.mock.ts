import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { NavigationLayoutConfig } from '../src/navigation-layout.client-config';

@Mock({ of: NavigationLayoutConfig })
export class NavigationLayoutConfigMock extends NavigationLayoutConfig {
    override whenReady = new Subject<void>();
}
