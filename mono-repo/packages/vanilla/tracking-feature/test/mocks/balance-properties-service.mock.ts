import { signal } from '@angular/core';

import { BalanceProperties } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { MockService } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';

export const BalancePropertiesServiceMock = MockService(BalancePropertiesService, {
    balanceInfo: signal<BalanceProperties | null>(null),
    balanceProperties: new BehaviorSubject<BalanceProperties | null>(null),
    transfer: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    isLow: jest.fn(),
});
