import { signal } from '@angular/core';

import { BalanceProperties } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { BalancePropertiesService } from '../src/balance-properties.service';

@Mock({ of: BalancePropertiesService })
export class BalancePropertiesServiceMock {
    balanceInfo = signal<BalanceProperties | null>(null);
    balanceProperties = new BehaviorSubject<BalanceProperties | null>(null);

    @StubObservable() transfer: jasmine.ObservableSpy;
    @Stub() refresh: jasmine.Spy;
    @Stub() update: jasmine.Spy;
    @Stub() isLow: jasmine.Spy;
}
