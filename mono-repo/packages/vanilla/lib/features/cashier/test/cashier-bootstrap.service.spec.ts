import { Overlay } from '@angular/cdk/overlay';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { QuickDepositAction } from '@frontend/vanilla/features/cashier';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ProductHomepagesConfigMock } from '../../../core/test/products/product-homepages.client-config.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AccountMenuDataServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { LabelSwitcherConfigMock, LabelSwitcherServiceMock } from '../../label-switcher/test/label-switcher.mock';
import { CashierBootstrapService } from '../src/cashier-bootstrap.service';
import { CashierConfigMock, CashierServiceMock, QuickDepositOverlayServiceMock, QuickDepositServiceMock } from './cashier.mock';

describe('CashierBootstrapService', () => {
    let service: CashierBootstrapService;
    let userServiceMock: UserServiceMock;
    let cashierConfigMock: CashierConfigMock;
    let quickDepositServiceMock: QuickDepositServiceMock;
    let quickDepositOvarlayServiceMock: QuickDepositOverlayServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        cashierConfigMock = MockContext.useMock(CashierConfigMock);
        quickDepositServiceMock = MockContext.useMock(QuickDepositServiceMock);
        quickDepositOvarlayServiceMock = MockContext.useMock(QuickDepositOverlayServiceMock);
        MockContext.useMock(LabelSwitcherConfigMock);
        MockContext.useMock(LabelSwitcherServiceMock);
        MockContext.useMock(CashierServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(ToastrQueueServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(ProductHomepagesConfigMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CashierBootstrapService, Overlay],
        });
        service = TestBed.inject(CashierBootstrapService);
        cashierConfigMock.isQuickDepositEnabled = true;
    });

    it('should show overlay for responsive when user is authenticated', fakeAsync(() => {
        service.onFeatureInit();
        cashierConfigMock.whenReady.next();
        tick();

        quickDepositServiceMock.events.next({
            action: QuickDepositAction.Open,
            options: {},
        });

        expect(quickDepositOvarlayServiceMock.show).toHaveBeenCalled();
    }));

    it('should show overlay for responsive on user login event', fakeAsync(() => {
        userServiceMock.isAuthenticated = false;
        service.onFeatureInit();
        cashierConfigMock.whenReady.next();
        tick();

        userServiceMock.triggerEvent(new UserLoginEvent());
        quickDepositServiceMock.events.next({
            action: QuickDepositAction.Open,
            options: {},
        });

        expect(quickDepositOvarlayServiceMock.show).toHaveBeenCalled();
    }));
});
