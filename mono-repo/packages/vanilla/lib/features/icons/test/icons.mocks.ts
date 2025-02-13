import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { IconsetConfig } from '../src/icons.client-config';

@Mock({ of: IconsetConfig })
export class IconSetConfigMock extends IconsetConfig {
    override whenReady = new Subject<void>();
}
