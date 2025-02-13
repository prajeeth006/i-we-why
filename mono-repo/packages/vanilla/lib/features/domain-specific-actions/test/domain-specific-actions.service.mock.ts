import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { DomainSpecificActionsConfig } from '../src/domain-specific-actions.client-config';

@Mock({ of: DomainSpecificActionsConfig })
export class DomainSpecificActionsConfigMock extends DomainSpecificActionsConfig {
    override whenReady = new Subject<void>();
}
