import { BalancePropertiesCoreService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

import { BalancePropertiesService } from '../src/balance-properties.service';

@Mock({ of: BalancePropertiesCoreService })
export class BalancePropertiesCoreServiceMock extends BalancePropertiesService {
    @Stub() set: jasmine.Spy;
}
