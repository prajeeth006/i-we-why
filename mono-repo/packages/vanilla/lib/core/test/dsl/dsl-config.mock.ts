import { Mock } from 'moxxi';

import { DslConfig } from '../../src/dsl/dsl.client-config';

@Mock({ of: DslConfig })
export class DslConfigMock extends DslConfig {}
