import { signal } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

import { BalanceBreakdownService } from '../src/balance-breakdown.service';

@Mock({ of: BalanceBreakdownService })
export class BalanceBreakdownServiceMock {
    @Stub() getBalanceBreakdownComponent: jasmine.Spy;
    @Stub() setBalanceBreakdownComponent: jasmine.Spy;
    slide = signal<MenuContentItem | null>(null);
    isSingleProduct = signal<boolean>(false);
}
