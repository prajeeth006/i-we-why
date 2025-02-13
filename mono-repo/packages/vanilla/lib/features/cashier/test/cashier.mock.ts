import { CashierService as PublicCashierService } from '@frontend/vanilla/core';
import { QuickDepositEvent } from '@frontend/vanilla/features/cashier';
import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { CashierResourceService } from '../src/cashier-resource.service';
import { CashierService } from '../src/cashier.service';
import { QuickDepositOverlayService } from '../src/quick-deposit/quick-deposit-overlay.service';
import { QuickDepositService } from '../src/quick-deposit/quick-deposit.service';

@Mock({ of: PublicCashierService })
export class PublicCashierServiceMock {
    whenReady = new Subject<void>();
    @Stub() goToCashier: jasmine.Spy;
    @Stub() goToCashierDeposit: jasmine.Spy;
    @Stub() goToCashierWithdrawal: jasmine.Spy;
    @Stub() gotoManageMyCards: jasmine.Spy;
    @Stub() generateCashierUrl: jasmine.Spy;
    @Stub() goToTransactionHistory: jasmine.Spy;
    @Stub() goToPaymentPreferences: jasmine.Spy;
}

@Mock({ of: CashierService })
export class CashierServiceMock extends PublicCashierServiceMock {
    override whenReady = new Subject<void>();
    @Stub() registerGoToDepositHook: jasmine.Spy;
    @StubPromise() runDepositHooks: jasmine.PromiseSpy;
}

@Mock({ of: QuickDepositService })
export class QuickDepositServiceMock {
    events = new Subject<QuickDepositEvent>();
    @Stub() open: jasmine.Spy;
    @StubObservable() isEnabled: jasmine.ObservableSpy;
}

@Mock({ of: QuickDepositOverlayService })
export class QuickDepositOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}

@Mock({ of: CashierResourceService })
export class CashierResourceServiceMock {
    @StubObservable() quickDepositEnabled: jasmine.ObservableSpy;
}

@Mock({ of: CashierConfig })
export class CashierConfigMock {
    [key: string]: any;
    whenReady = new Subject<void>();
    depositUrlTemplate: string;
    withdrawUrlTemplate: string;
    transactionHistoryUrlTemplate: string;
    urlTemplate: string;
    manageMyCardsUrlTemplate: string;
    paymentPreferencesUrlTemplate: string;
    host: string;
    singleSignOnIntegrationType: string = 'query' || 'cookie';
    trackerIds: { [origin: string]: string } = {};
    quickDepositUrlTemplate: string;
    isQuickDepositEnabled: boolean;
}
