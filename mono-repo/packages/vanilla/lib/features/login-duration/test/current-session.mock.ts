import { CurrentSessionConfig } from '@frontend/vanilla/shared/current-session';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: CurrentSessionConfig })
export class CurrentSessionConfigMock extends CurrentSessionConfig {
    override whenReady = new Subject<void>();
}
