import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CashierRouteAction } from '@frontend/vanilla/features/cashier';
import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { LastKnownProductServiceMock } from '../../../core/test/last-known-product/last-known-product.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { CashierComponent } from '../src/cashier.component';
import { CashierConfigMock, CashierServiceMock } from './cashier.mock';

describe('CashierComponent', () => {
    let fixture: ComponentFixture<CashierComponent>;
    let navigationServiceMock: NavigationServiceMock;
    let cashierConfigClientConfigMock: CashierConfigMock;
    let cashierServiceMock: CashierServiceMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;
    let activatedRouteMock: ActivatedRouteMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        cashierConfigClientConfigMock = MockContext.useMock(CashierConfigMock);
        cashierServiceMock = MockContext.useMock(CashierServiceMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
        TestBed.overrideComponent(CashierComponent, {
            set: {
                providers: [MockContext.providers],
            },
        });

        lastKnownProductServiceMock.get.and.returnValue({ url: 'http://bla.com' });
    });

    function initComponent() {
        fixture = TestBed.createComponent(CashierComponent);
        fixture.detectChanges();
    }

    describe('ngOnInit', () => {
        it('should be called with actual values', fakeAsync(() => {
            initComponent();
            cashierConfigClientConfigMock.whenReady.next();
            tick();

            expect(cashierServiceMock.goToCashier).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should be called with actual values and bonusCodeForPrefill', fakeAsync(() => {
            navigationServiceMock.location.search.append('bonusCodeForPrefill', 'BC001');
            initComponent();
            cashierConfigClientConfigMock.whenReady.next();
            tick();

            expect(cashierServiceMock.goToCashier).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should redirect to LastKnownProduct if set', fakeAsync(() => {
            initComponent();
            cashierConfigClientConfigMock.whenReady.next();
            tick();

            expect(cashierServiceMock.goToCashier).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should call gotoCashierDeposit when action parameter is deposit', fakeAsync(() => {
            setupRouteAction(CashierRouteAction.Deposit);

            expect(cashierServiceMock.goToCashierDeposit).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should call goToCashierWithdrawal when action parameter is withdrawal', fakeAsync(() => {
            setupRouteAction(CashierRouteAction.Withdrawal);

            expect(cashierServiceMock.goToCashierWithdrawal).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should call goToTransactionHistory when action parameter is transactionhistory', fakeAsync(() => {
            setupRouteAction(CashierRouteAction.TransactionHistory);

            expect(cashierServiceMock.goToTransactionHistory).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        it('should call goToPaymentPreferences when action parameter is paymentpreferences', fakeAsync(() => {
            setupRouteAction(CashierRouteAction.PaymentPreferences);

            expect(cashierServiceMock.goToPaymentPreferences).toHaveBeenCalledWith({
                trackerId: cashierConfigClientConfigMock.trackerIds['menu'],
                returnUrl: 'http://bla.com',
                replaceInHistory: true,
            });
        }));

        function setupRouteAction(action: string) {
            navigationServiceMock.location.search.append('bonusCodeForPrefill', 'BC001');
            activatedRouteMock.snapshot.params['action'] = action;
            initComponent();
            cashierConfigClientConfigMock.whenReady.next();
            tick();
        }
    });
});
