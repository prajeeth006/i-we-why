import { BalancePropertiesConfig } from '@frontend/vanilla/features/balance-properties';
import { MockService } from 'ng-mocks';
import { Subject } from 'rxjs';

export const BalancePropertiesConfigMock = MockService(BalancePropertiesConfig, {
    whenReady: new Subject<void>(),
    isConfigReady: true,
});
