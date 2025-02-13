import { LazyClientConfigService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { BalancePropertiesCoreService } from '../../src/lazy/service-providers/balance-properties-core.service';
import { BalanceProperties } from '../../src/user/user.models';

@Mock({ of: LazyClientConfigService })
export class LazyClientConfigServiceMock {
    @Stub() get: jasmine.Spy;
    @Stub() eagerLoad: jasmine.Spy;
}

@Mock({ of: BalancePropertiesCoreService })
export class BalancePropertiesCoreServiceMock {
    whenReady = new Subject<void>();
    balanceInfo: BalanceProperties;
}
