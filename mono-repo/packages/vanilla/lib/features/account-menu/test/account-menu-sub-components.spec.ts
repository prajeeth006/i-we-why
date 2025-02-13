import { CommonModule } from '@angular/common';
import { ElementRef, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BalanceProperties, ContentItem, MenuContentItem, VanillaElements, VanillaEventNames } from '@frontend/vanilla/core';
import { LabelSwitcherItem } from '@frontend/vanilla/features/label-switcher';
import { DrawerPosition, MenuRoute } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';
import { Observable, Subject, of } from 'rxjs';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { ArithmeticServiceMock } from '../../../core/test/math/arithmetic.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OffersServiceMock } from '../../../shared/offers/test/offers.mocks';
import { TooltipsConfigMock } from '../../../shared/tooltips/test/tooltips-content.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { BonusBalanceServiceMock } from '../../bonus-balance/test/bonus-balance.mock';
import { ContentMessagesServiceMock } from '../../content-messages/test/content-messages.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { InboxCoreServiceMock as InboxServiceMock } from '../../inbox/test/inbox.mock';
import { LabelSwitcherServiceMock } from '../../label-switcher/test/label-switcher.mock';
import { AvailableBalanceComponent } from '../src/sub-components/available-balance.component';
import { AccountMenuBalanceHeaderItemComponent } from '../src/sub-components/balance-header-item.component';
import { BalanceItemComponent } from '../src/sub-components/balance-item.component';
import { BonusBalanceItemComponent } from '../src/sub-components/bonus-balance-item.component';
import { BonusBalanceComponent } from '../src/sub-components/bonus-balance.component';
import { CashierItemComponent } from '../src/sub-components/cashier-item.component';
import { ChatBubbleComponent } from '../src/sub-components/chat-bubble.component';
import { ContentMessagesComponent } from '../src/sub-components/content-messages.component';
import { HeaderAvatarComponent } from '../src/sub-components/header-avatar.component';
import { HeaderCloseComponent } from '../src/sub-components/header-close.component';
import { HeaderInboxComponent } from '../src/sub-components/header-inbox.component';
import { HeaderComponent } from '../src/sub-components/header.component';
import { IconMenuComponent } from '../src/sub-components/icon-menu.component';
import { LabelSwitcherMenuComponent } from '../src/sub-components/label-switcher-menu.component';
import { LastLoginComponent } from '../src/sub-components/last-login.component';
import { ListLayoutComponent } from '../src/sub-components/list-layout.component';
import { LogoutComponent } from '../src/sub-components/logout.component';
import { MainLayoutComponent } from '../src/sub-components/main-layout.component';
import { MenuItemComponent } from '../src/sub-components/menu-item.component';
import { RowLayoutComponent } from '../src/sub-components/row-layout.component';
import { BalanceTileItemComponent } from '../src/sub-components/slider-tiles/balance-tile-item.component';
import { BalanceTileComponent } from '../src/sub-components/slider-tiles/balance-tile.component';
import { BonusesTileComponent } from '../src/sub-components/slider-tiles/bonuses-tile.component';
import { CasinoCashbackTileComponent } from '../src/sub-components/slider-tiles/casino-cashback-tile.component';
import { CoralCashbackTileComponent } from '../src/sub-components/slider-tiles/coral-cashback-tile.component';
import { PokerCashbackTileComponent } from '../src/sub-components/slider-tiles/poker-cashback-tile.component';
import { SlotComponent } from '../src/sub-components/slot.component';
import { VerificationStatusComponent } from '../src/sub-components/verification-status.component';
import { AccountMenuDataServiceMock, AccountMenuTasksServiceMock } from './account-menu-data.mock';
import { AccountMenuDrawerServiceMock } from './account-menu-drawer.service.mock';
import { AccountMenuRouterMock } from './account-menu-router.mock';
import { AccountMenuScrollServiceMock } from './account-menu-scroll.mock';
import { AccountMenuTrackingServiceMock } from './account-menu-tracking.mock';
import { AccountMenuVipServiceMock } from './account-menu-vip.mock';
import { AccountMenuServiceMock } from './account-menu.mock';
import { AccountMenuConfigMock } from './menu-content.mock';
import { MenuItemsServiceMock } from './menu-items.mock';

// TODO: Split in separate files
describe('AccountMenuItemComponent', () => {
    let fixture: ComponentFixture<any>;
    let accountMenuServiceMock: AccountMenuServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let userMock: UserServiceMock;
    let arithmeticServiceMock: ArithmeticServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let menuContentMock: AccountMenuConfigMock;
    let commonMessagesMock: CommonMessagesMock;
    let observableMediaMock: MediaQueryServiceMock;
    let intlServiceMock: IntlServiceMock;
    let dslServiceMock: DslServiceMock;
    let bonusBalanceServiceMock: BonusBalanceServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let contentMessagesServiceMock: ContentMessagesServiceMock;
    let accountMenuVipServiceMock: AccountMenuVipServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let inboxServiceMock: InboxServiceMock;
    let accountMenuRouterMock: AccountMenuRouterMock;
    let offersServiceMock: OffersServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let accountMenuScrollServiceMock: AccountMenuScrollServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;
    let labelSwitcherServiceMock: LabelSwitcherServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let accountMenuDrawerServiceMock: AccountMenuDrawerServiceMock;
    let timerServiceMock: TimerServiceMock;
    let accountMenuTasksServiceMock: AccountMenuTasksServiceMock;
    let elementRepositoryServiceMock: ElementRepositoryServiceMock;

    let item: MenuContentItem;

    beforeEach(() => {
        accountMenuServiceMock = MockContext.useMock(AccountMenuServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);
        observableMediaMock = MockContext.useMock(MediaQueryServiceMock);
        arithmeticServiceMock = MockContext.useMock(ArithmeticServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        bonusBalanceServiceMock = MockContext.useMock(BonusBalanceServiceMock);
        accountMenuVipServiceMock = MockContext.useMock(AccountMenuVipServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);
        contentMessagesServiceMock = MockContext.useMock(ContentMessagesServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        inboxServiceMock = MockContext.useMock(InboxServiceMock);
        accountMenuRouterMock = MockContext.useMock(AccountMenuRouterMock);
        offersServiceMock = MockContext.useMock(OffersServiceMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        accountMenuScrollServiceMock = MockContext.useMock(AccountMenuScrollServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        labelSwitcherServiceMock = MockContext.useMock(LabelSwitcherServiceMock);
        accountMenuDrawerServiceMock = MockContext.useMock(AccountMenuDrawerServiceMock);
        timerServiceMock = MockContext.useMock(TimerServiceMock);
        accountMenuTasksServiceMock = MockContext.useMock(AccountMenuTasksServiceMock);
        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        item = <any>{
            text: 'text',
            url: 'url',
            clickAction: 'action',
            type: 'type',
            name: 'name',
            parameters: {},
            resources: {},
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
        };

        accountMenuServiceMock.resources = {
            messages: {},
        };

        userMock.claims = <any>claimsServiceMock;
    });

    function initComponent<
        T extends
            | LogoutComponent
            | MainLayoutComponent
            | ListLayoutComponent
            | MenuItemComponent
            | LastLoginComponent
            | BalanceItemComponent
            | AvailableBalanceComponent
            | SlotComponent
            | HeaderComponent
            | HeaderAvatarComponent
            | BalanceTileComponent
            | ContentMessagesComponent
            | ChatBubbleComponent
            | HeaderInboxComponent
            | BonusesTileComponent
            | RowLayoutComponent
            | BalanceTileItemComponent
            | CasinoCashbackTileComponent
            | CoralCashbackTileComponent
            | PokerCashbackTileComponent
            | BonusBalanceItemComponent
            | BonusBalanceComponent
            | CashierItemComponent
            | AccountMenuBalanceHeaderItemComponent
            | HeaderCloseComponent
            | VerificationStatusComponent
            | LabelSwitcherMenuComponent
            | IconMenuComponent,
    >(type: Type<T>) {
        TestBed.overrideComponent(type, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });
        fixture = TestBed.createComponent(type);

        fixture.componentInstance.item = item;

        fixture.detectChanges();
    }

    describe('common', () => {
        describe('processClick()', () => {
            it('should navigate to menu route if item has menuRoute property', () => {
                initComponent(MenuItemComponent);

                const event = new Event('click');
                const preventSpy = spyOn(event, 'preventDefault');

                item.menuRoute = 'route';
                fixture.componentInstance.processClick(event, item);

                expect(accountMenuServiceMock.toggle).not.toHaveBeenCalled();
                expect(menuActionsServiceMock.processClick).not.toHaveBeenCalled();
                expect(accountMenuRouterMock.navigateToRoute).toHaveBeenCalledWith('route');
                expect(preventSpy).toHaveBeenCalled();
            });

            it('should close menu and process specified menu action', () => {
                initComponent(MenuItemComponent);

                const event = new Event('click');

                fixture.componentInstance.processClick(event, item);

                expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false);
                expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Menu', true);
            });

            it('should not toggle menu in router mode', () => {
                accountMenuServiceMock.routerMode = true;

                initComponent(MenuItemComponent);

                const event = new Event('click');

                fixture.componentInstance.processClick(event, item);

                expect(accountMenuServiceMock.toggle).not.toHaveBeenCalled();
                expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Menu', true);
            });

            testMenuRouteNavigationStrategy('always', 'always', () => {}, true);
            testMenuRouteNavigationStrategy('always in router mode', 'always', () => (accountMenuServiceMock.routerMode = true), true);
            testMenuRouteNavigationStrategy('router mode', 'router-mode-only', () => {}, false);
            testMenuRouteNavigationStrategy('router mode in router mode', 'router-mode-only', () => (accountMenuServiceMock.routerMode = true), true);
            testMenuRouteNavigationStrategy('overlay mode', 'overlay-only', () => {}, true);
            testMenuRouteNavigationStrategy('overlay mode in router mode', 'overlay-only', () => (accountMenuServiceMock.routerMode = true), false);
            testMenuRouteNavigationStrategy('never', 'never', () => {}, false);
            testMenuRouteNavigationStrategy('never in router mode', 'never', () => (accountMenuServiceMock.routerMode = true), false);

            function testMenuRouteNavigationStrategy(decs: string, strategy: string, setup: () => void, shouldNavigateToMenuRoute: boolean) {
                it(`should${shouldNavigateToMenuRoute ? '' : ' not'} navigate to menu route with ${strategy} strategy - ${decs}`, () => {
                    item.menuRoute = 'route';
                    item.parameters['menu-route-navigation-strategy'] = strategy;
                    initComponent(MenuItemComponent);
                    setup();

                    const event = new Event('click');

                    fixture.componentInstance.processClick(event, item);

                    if (shouldNavigateToMenuRoute) {
                        expect(accountMenuRouterMock.navigateToRoute).toHaveBeenCalledWith('route');
                        expect(menuActionsServiceMock.processClick).not.toHaveBeenCalled();
                    } else {
                        expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Menu', true);
                        expect(accountMenuRouterMock.navigateToRoute).not.toHaveBeenCalled();
                    }
                });
            }
        });
    });

    describe('LogoutComponent', () => {
        beforeEach(() => {
            TestBed.overrideComponent(LogoutComponent, {
                set: {
                    imports: [CommonModule],
                    schemas: [NO_ERRORS_SCHEMA],
                },
            });
        });
        describe('init', () => {
            it('should set static content properties', () => {
                initComponent(LogoutComponent);

                expect((fixture.componentInstance as LogoutComponent).msg).toBe(commonMessagesMock);
            });
        });

        describe('logout()', () => {
            it('should invoke logout and set wait', fakeAsync(() => {
                initComponent(LogoutComponent);

                const component = fixture.componentInstance as LogoutComponent;

                component.logout();

                expect(component.wait).toBeTrue();
                expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('logout', 'Menu', [undefined, undefined, { manualLogout: 'true' }]);

                menuActionsServiceMock.invoke.resolve();
                tick();

                expect(component.wait).toBeFalse();
            }));

            it('should not invoke logout multiple times', fakeAsync(() => {
                initComponent(LogoutComponent);

                const component = fixture.componentInstance as LogoutComponent;

                component.logout();
                component.logout();

                expect(menuActionsServiceMock.invoke).toHaveBeenCalledTimes(1);
            }));
        });
    });

    describe('LastLoginComponent', () => {
        describe('init', () => {
            it('should set message', () => {
                userMock.lastLoginTimeFormatted = <any>'date';
                item.text = 'Last Login __DATE__';
                intlServiceMock.formatDate.and.returnValue('date');
                initComponent(LastLoginComponent);

                const component = fixture.componentInstance as LastLoginComponent;

                expect(component.message).toBe('Last Login date');
                expect(component.show).toBeTrue();
            });

            it('should not set message on first login', () => {
                userMock.lastLoginTimeFormatted = undefined;
                userMock.isFirstLogin = true;

                initComponent(LastLoginComponent);

                const component = fixture.componentInstance as LastLoginComponent;

                expect(component.message).toBeUndefined();
                expect(component.show).toBeFalse();
            });
        });
    });

    describe('LabelSwitcherMenuComponent', () => {
        it('showOverlay', () => {
            const labelSwitcherItem = {
                name: 'test',
                text: 'new',
                url: 'url dest',
            } as LabelSwitcherItem;
            initComponent(LabelSwitcherMenuComponent);

            const component = fixture.componentInstance as LabelSwitcherMenuComponent;

            component.switchLabel(labelSwitcherItem);
            expect(labelSwitcherServiceMock.switchLabel).toHaveBeenCalledWith({
                name: 'test',
                text: 'new',
                url: 'url dest',
            });
            expect(accountMenuTrackingServiceMock.trackLabelSwitcherMenuClicked).toHaveBeenCalledWith('new', 'Indiana', 'url dest');
        });
    });

    describe('ListLayoutComponent', () => {
        describe('init', () => {
            it('should set static content properties', () => {
                initComponent(ListLayoutComponent);

                const component = fixture.componentInstance as ListLayoutComponent;

                expect(component.media).toBe(<any>observableMediaMock);
            });
        });

        describe('close()', () => {
            it('should close the menu', () => {
                initComponent(ListLayoutComponent);

                const component = fixture.componentInstance as ListLayoutComponent;

                component.close();

                expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false, { closedWithButton: true });
            });
        });

        describe('goBack()', () => {
            it('should navigate back', () => {
                initComponent(ListLayoutComponent);

                const component = fixture.componentInstance as ListLayoutComponent;

                const parent = { item: { name: 'a', menuRoute: 'parent' } };
                const current = { parent, item: { name: 'b' } };

                accountMenuRouterMock.currentRoute.next(current as any);

                component.goBack();

                expect(accountMenuRouterMock.navigateToRoute).toHaveBeenCalledWith('parent', true, undefined);
            });
        });
    });

    describe('MainLayoutComponent', () => {
        describe('close()', () => {
            it('should close the menu', () => {
                TestBed.overrideComponent(MainLayoutComponent, {
                    set: {
                        imports: [],
                        schemas: [NO_ERRORS_SCHEMA],
                    },
                });
                initComponent(MainLayoutComponent);

                const component = fixture.componentInstance as MainLayoutComponent;

                component.close();

                expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false, { closedWithButton: true });
            });
        });
    });

    describe('BalanceItemComponent', () => {
        describe('ngOnInit', () => {
            beforeEach(() => {
                menuContentMock.resources.messages['Tooltip'] = 'tooltip text';
                menuContentMock.resources.messages['Details'] = 'see details';

                item.parameters['formula'] = 'f';

                const balance = { accountBalance: 5 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);

                arithmeticServiceMock.solve.withArgs('f', balance).and.returnValue(9);
            });

            it('should set parameters', () => {
                item.parameters['tooltip-text-ref'] = 'Tooltip';
                item.parameters['details-text-ref'] = 'Details';

                initComponent(BalanceItemComponent);

                const component = fixture.componentInstance as BalanceItemComponent;

                expect(component.balance).toBe(9);
                expect(component.detailsLinkText).toBe('see details');
                expect(component.tooltipText).toBe('tooltip text');
                expect(component.hideIfZero).toBeFalse();
                expect(component.hideDetailsIfZero).toBeFalse();
            });

            it('should not set details text and tooltip text if not in parameters', () => {
                initComponent(BalanceItemComponent);

                const component = fixture.componentInstance as BalanceItemComponent;

                expect(component.balance).toBe(9);
                expect(component.detailsLinkText).toBeUndefined();
                expect(component.tooltipText).toBeUndefined();
            });

            it('should set hide parameters to true', () => {
                item.parameters['hide-if-zero'] = 'true';
                item.parameters['hide-details-if-zero'] = 'true';

                initComponent(BalanceItemComponent);

                const component = fixture.componentInstance as BalanceItemComponent;

                expect(component.hideIfZero).toBeTrue();
                expect(component.hideDetailsIfZero).toBeTrue();
            });
        });
    });

    describe('CashierItemComponent', () => {
        describe('init', () => {
            it('should use balance DSL if available', () => {
                item.parameters['formula'] = 'f';
                item.parameters['balance'] = 'DSL';

                initComponent(CashierItemComponent);

                const component = fixture.componentInstance as CashierItemComponent;

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledOnceWith('DSL');
                expect(component.balanceFormula).toBeUndefined();
            });

            it('should use balance formula DSL is not available', () => {
                item.parameters['formula'] = 'f';

                initComponent(CashierItemComponent);

                const component = fixture.componentInstance as CashierItemComponent;

                expect(component.balanceFormula).toBe('f');
                expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
            });
        });
    });

    describe('AvailableBalanceComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                menuContentMock.resources.messages['PayPalMessage'] = '__AMOUNT__ in Pay Pal';
                menuContentMock.resources.messages['ReleaseFunds'] = 'Release funds';
                menuContentMock.resources.messages['ReleaseFundsConfirmation'] = 'Funds released';
                menuContentMock.resources.messages['ReleaseFundsInfo'] = 'Release funds tooltip info';
                menuContentMock.account.isPaypalBalanceMessageEnabled = 'messageCondition';
                menuContentMock.account.isPaypalReleaseFundsEnabled = 'releaseFundscondition';

                item.parameters['formula'] = 'f';
                item.parameters['paypal-text-ref'] = 'PayPalMessage';
                item.parameters['tooltip-text-ref'] = 'ReleaseFundsInfo';

                const balance = { accountBalance: 5, payPalBalance: 2 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);

                arithmeticServiceMock.solve.withArgs('f', balance).and.returnValue(9);
            });

            it('should set parameters', () => {
                const balance = { accountBalance: 5 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);
                arithmeticServiceMock.solve.withArgs('f', balance).and.returnValue(9);

                initComponent(AvailableBalanceComponent);

                const component = fixture.componentInstance as AvailableBalanceComponent;

                expect(component.balance).toBe(9);
                expect(component.payPalBalanceMessage).toBeUndefined();
                expect(component.showPayPalBalanceMessage).toBeUndefined();
                expect(component.showReleaseFunds).toBeUndefined();
            });

            it('should set PayPal balance and message when there is PayPal balance', () => {
                item.parameters['paypal-text-ref'] = 'PayPalMessage';

                const balance = { accountBalance: 5, payPalBalance: 2 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);

                intlServiceMock.formatCurrency.and.returnValue('2$');
                initComponent(AvailableBalanceComponent);

                const component = fixture.componentInstance as AvailableBalanceComponent;

                expect(component.payPalBalance).toBe(2);
                expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(2);
                expect(component.payPalBalanceMessage).toBe('2$ in Pay Pal');
            });

            it('should show PayPal message and set release funds properties when enabled', () => {
                item.parameters['paypal-text-ref'] = 'PayPalMessage';
                dslServiceMock.evaluateExpression.withArgs('messageCondition').and.returnValue(of(true));
                dslServiceMock.evaluateExpression.withArgs('releaseFundscondition').and.returnValue(of(true));

                initComponent(AvailableBalanceComponent);
                const component = fixture.componentInstance as AvailableBalanceComponent;

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('messageCondition');
                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('releaseFundscondition');
                expect(component.showPayPalBalanceMessage).toBeTrue();
                expect(component.showReleaseFunds).toBeTrue();
                expect(component.releaseFundsText).toBe('Release funds');
                expect(component.releaseFundsTooltipText).toBe('Release funds tooltip info');
            });

            it('should release PayPal funds', () => {
                initComponent(AvailableBalanceComponent);
                const component = fixture.componentInstance as AvailableBalanceComponent;

                balancePropertiesServiceMock.transfer.and.returnValue(of({}));

                component.releaseFunds();

                expect(balancePropertiesServiceMock.transfer).toHaveBeenCalledWith({
                    amount: 2,
                    fromBalanceType: 'PAYPAL_BAL',
                    toBalanceType: 'MAIN_REAL_BAL',
                });
                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
                expect(component.payPalBalanceMessage).toBe('Funds released');
                expect(component.showReleaseFunds).toBeFalse();
            });
        });
    });

    describe('BonusBalanceComponent', () => {
        describe('init', () => {
            it('should refresh bonus balance', () => {
                initComponent(BonusBalanceComponent);

                expect(bonusBalanceServiceMock.refresh).toHaveBeenCalled();
            });
        });
    });

    describe('BonusBalanceItemComponent', () => {
        describe('init', () => {
            it('should calculate balance', () => {
                item.parameters['formula'] = 'aaa';
                balancePropertiesServiceMock.balanceProperties.next({ accountBalance: 1 } as BalanceProperties);
                bonusBalanceServiceMock.bonusBalance.next({ CASINO: 2 });
                arithmeticServiceMock.solve
                    .withArgs('aaa', {
                        accountBalance: 1,
                        bonusCasinoRestrictedBalance: 2,
                    })
                    .and.returnValue(50);
                initComponent(BonusBalanceItemComponent);
                const component = fixture.componentInstance as BonusBalanceItemComponent;

                expect(arithmeticServiceMock.solve).toHaveBeenCalledWith('aaa', {
                    accountBalance: 1,
                    bonusCasinoRestrictedBalance: 2,
                });

                expect(component.balance).toBe(50);
            });
        });
    });

    describe('HeaderComponent', () => {
        describe('close()', () => {
            it('should close the menu', () => {
                initComponent(HeaderComponent);

                const component = fixture.componentInstance as HeaderComponent;

                component.close();

                expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false, { closedWithButton: true });
            });
        });

        describe('scrolled', () => {
            it('should set scrolled to true when menu is scrolled', () => {
                initComponent(HeaderComponent);

                const component = fixture.componentInstance as HeaderComponent;

                expect(component.scrolled).toBeUndefined();

                accountMenuScrollServiceMock.scroll.next(100);

                expect(component.scrolled).toBeTrue();
            });

            it('should set scrolled to false when menu is not scrolled', () => {
                initComponent(HeaderComponent);

                const component = fixture.componentInstance as HeaderComponent;

                expect(component.scrolled).toBeUndefined();

                accountMenuScrollServiceMock.scroll.next(0);
                expect(component.scrolled).toBeFalse();

                accountMenuScrollServiceMock.scroll.next(100);
                accountMenuScrollServiceMock.scroll.next(-100);
                expect(component.scrolled).toBeFalse();
            });
        });
    });

    describe('HeaderAvatarComponent', () => {
        describe('init', () => {
            it('should populate fields', () => {
                initComponent(HeaderAvatarComponent);
                const component = fixture.componentInstance as HeaderAvatarComponent;

                accountMenuScrollServiceMock.scroll.next(10);

                expect(component.scrolled).toBeTrue();
            });
        });
        describe('restore', () => {
            it('should scroll to top', () => {
                initComponent(HeaderAvatarComponent);
                const component = fixture.componentInstance as HeaderAvatarComponent;

                component.restore();

                expect(accountMenuScrollServiceMock.scrollTo).toHaveBeenCalledWith(0, 0);
            });
        });
    });

    describe('BalanceTileComponent', () => {
        beforeEach(() => {
            item.children = <any>[
                { name: 'mainbalance', parameters: { balance: 'a+b' } },
                { name: 'sub1', parameters: { 'chart-segment': '2', 'balance': 'a' } },
                { name: 'sub2', parameters: { 'chart-segment': '1', 'balance': 'b' } },
            ];

            dslServiceMock.evaluateExpression.withArgs('a+b').and.returnValue(of(10));
            dslServiceMock.evaluateExpression.withArgs('a').and.returnValue(of(8));
            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(of(2));
        });

        describe('init', () => {
            it('should not call third party balance refresh if disabled', () => {
                initComponent(BalanceTileComponent);

                expect(bonusBalanceServiceMock.refresh).not.toHaveBeenCalled();
            });

            it('should calculate balance and chart segments', () => {
                initComponent(BalanceTileComponent);
                const component = fixture.componentInstance as BalanceTileComponent;

                expect(component.chartSegments).toEqual([
                    { class: 'sub2', percent: 20 },
                    { class: 'sub1', percent: 80 },
                ]);
            });

            it('should not fill chart if balance is 0', () => {
                dslServiceMock.evaluateExpression.withArgs('a+b').and.returnValue(of(0));

                initComponent(BalanceTileComponent);
                const component = fixture.componentInstance as BalanceTileComponent;

                expect(component.chartSegments).toEqual([]);
            });

            it('should not fill chart if main balance doesnt exist', () => {
                item.children = item.children.slice(1);

                initComponent(BalanceTileComponent);
                const component = fixture.componentInstance as BalanceTileComponent;

                expect(component.chartSegments).toEqual([]);
            });
        });
    });

    describe('ContentMessagesComponent', () => {
        describe('init', () => {
            it('should populate fields', () => {
                const messages: ContentItem[] = [{ name: 'n', templateName: 'text' }];
                item.parameters['source'] = 's';
                item.parameters['closed-cookie-key'] = 'c';
                contentMessagesServiceMock.getMessages.and.returnValue(of({ s: messages }));

                initComponent(ContentMessagesComponent);
                const component = fixture.componentInstance as ContentMessagesComponent;

                expect(component.messages).toBe(messages);
                expect(component.closedCookieKey).toBe('c');
            });
        });
    });

    describe('PokerCashbackTileComponent', () => {
        beforeEach(() => {
            accountMenuServiceMock.resources.messages['PokerCashbackOptedIn'] = 'opted in {0} {1} {2} {3}';
            accountMenuServiceMock.resources.messages['PokerCashbackNotOptedIn'] = 'not opted in';
            accountMenuServiceMock.resources.messages['PokerCashbackOptedInV3'] = 'opted in {0} {1} {2} v3';
            accountMenuServiceMock.resources.messages['PokerCashbackNotOptedInV3'] = 'not opted in v3';
        });

        describe('init', () => {
            it('should show not opted in message', () => {
                initComponent(PokerCashbackTileComponent);
                const component = fixture.componentInstance as PokerCashbackTileComponent;

                expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                    {
                        'LoadedEvent.component.PositionEvent': 'test',
                    },
                    'LoadedEvent',
                );

                accountMenuServiceMock.pokerCashbackEvents.next({
                    hasOptedIn: false,
                    pointsRequiredForNextSlab: 80,
                    isOptin: 'N',
                    weeklyPoints: 20,
                    nextSlabPoints: 100,
                    currency: 'Z',
                    targetCashback: '10',
                    awardType: 'Poker_dollars',
                });
                expect(component.text).toBeUndefined();
                expect(component.description).toBe('not opted in');
                expect(component.descriptionV3).toBe('not opted in v3');
                expect(component.chartSegments).toBeUndefined();
                expect(accountMenuServiceMock.updatePokerCashback).toHaveBeenCalled();
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'no opt-in',
                });
                expect(component.hideSkeleton).toBeTrue();
            });

            it('should init values for cashback when opted in', () => {
                initComponent(PokerCashbackTileComponent);
                const component = fixture.componentInstance as PokerCashbackTileComponent;

                accountMenuServiceMock.pokerCashbackEvents.next({
                    hasOptedIn: true,
                    pointsRequiredForNextSlab: 80,
                    isOptin: 'Y',
                    weeklyPoints: 20,
                    nextSlabPoints: 100,
                    currency: 'Z',
                    targetCashback: '10',
                    awardType: 'poker_dollars',
                });
                expect(component.text).toBe('20');
                expect(component.isCompleted).toBeFalse();
                expect(component.description).toBe('opted in 20 80 Z 10');
                expect(component.descriptionV3).toBe('opted in 20 80 Z10 v3');
                expect(component.chartSegments).toEqual([{ percent: 20 }]);
                expect(accountMenuServiceMock.updatePokerCashback).toHaveBeenCalled();
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'more points needed',
                });
            });

            it('should init values for tournament award types', () => {
                menuContentMock.account.pokerCashbackTournamentAwardTypes = ['poker_dollars'];
                menuContentMock.account.tournamentPokerCashbackSymbol = 'test';
                initComponent(PokerCashbackTileComponent);
                const component = fixture.componentInstance as PokerCashbackTileComponent;

                accountMenuServiceMock.pokerCashbackEvents.next({
                    hasOptedIn: true,
                    pointsRequiredForNextSlab: 80,
                    isOptin: 'Y',
                    weeklyPoints: 20,
                    nextSlabPoints: 100,
                    currency: 'Z',
                    targetCashback: '10',
                    awardType: 'poker_dollars',
                });
                expect(component.description).toBe('opted in 20 80 testZ 10');
                expect(component.descriptionV3).toBe('opted in 20 80 testZ10 v3');
            });

            it('should init values for completed cashback', () => {
                initComponent(PokerCashbackTileComponent);
                const component = fixture.componentInstance as PokerCashbackTileComponent;

                accountMenuServiceMock.pokerCashbackEvents.next({
                    hasOptedIn: true,
                    pointsRequiredForNextSlab: 80,
                    isOptin: 'Y',
                    weeklyPoints: 120,
                    nextSlabPoints: 100,
                    currency: 'Z',
                    targetCashback: '10',
                    awardType: 'Poker_dollars',
                });
                expect(component.isCompleted).toBeTrue();
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'more points needed',
                });
            });
        });
    });

    describe('CoralCashbackTileComponent', () => {
        beforeEach(() => {
            accountMenuServiceMock.resources.messages['CoralCashbackText'] = '{POINTS} and {AMOUNT}';
            accountMenuServiceMock.resources.messages['CoralCashbackNonVipMessage'] = 'VIP yourself now';
            accountMenuServiceMock.resources.messages['CoralCashbackTextV3'] = '{POINTS} and {AMOUNT} v3';
            accountMenuServiceMock.resources.messages['CoralCashbackNonVipMessageV3'] = 'VIP yourself now v3';
        });

        describe('init', () => {
            it('should show non vip message', () => {
                accountMenuVipServiceMock.isVip = false;
                initComponent(CoralCashbackTileComponent);
                const component = fixture.componentInstance as CoralCashbackTileComponent;

                expect(component.text).toBeUndefined();
                expect(component.description).toBe('VIP yourself now');
                expect(component.descriptionV3).toBe('VIP yourself now v3');
                expect(component.chartSegments).toBeUndefined();
                expect(accountMenuServiceMock.updateCoralCashback).not.toHaveBeenCalled();
            });

            it('should show non opted in message', () => {
                accountMenuVipServiceMock.isVip = false;
                initComponent(CoralCashbackTileComponent);
                const component = fixture.componentInstance as CoralCashbackTileComponent;

                accountMenuServiceMock.coralCashbackEvents.next(<any>{
                    currentPoints: 20,
                    minPointsReqForRedeem: 100,
                    cashbackCurrency: 'EUR',
                    cashbackAmount: 10,
                    optinStatus: false,
                });

                expect(component.text).toBeUndefined();
                expect(component.description).toBe('VIP yourself now');
                expect(component.descriptionV3).toBe('VIP yourself now v3');
                expect(component.chartSegments).toBeUndefined();
                expect(accountMenuServiceMock.updateCoralCashback).not.toHaveBeenCalled();
            });

            it('should init values for vip', () => {
                intlServiceMock.formatCurrency.and.returnValue('100 EUR');
                accountMenuVipServiceMock.isVip = true;
                initComponent(CoralCashbackTileComponent);
                const component = fixture.componentInstance as CoralCashbackTileComponent;

                accountMenuServiceMock.coralCashbackEvents.next(<any>{
                    currentPoints: 20,
                    minPointsReqForRedeem: 100,
                    cashbackCurrency: 'EUR',
                    cashbackAmount: 10,
                    optinStatus: true,
                });
                expect(component.text).toBe('20');
                expect(component.isCompleted).toBeFalse();
                expect(component.description).toBe('80 and 100 EUR');
                expect(component.descriptionV3).toBe('80 and 100 EUR v3');
                expect(component.chartSegments).toEqual([{ percent: 20 }]);
                expect(accountMenuServiceMock.updateCoralCashback).toHaveBeenCalled();
                expect(component.cashbackAmount).toBe('100 EUR');
                expect(component.hideSkeleton).toBeTrue();
            });

            it('should init values for completed cashback', () => {
                intlServiceMock.formatCurrency.and.returnValue('100 EUR');
                accountMenuVipServiceMock.isVip = true;
                initComponent(CoralCashbackTileComponent);
                const component = fixture.componentInstance as CoralCashbackTileComponent;

                accountMenuServiceMock.coralCashbackEvents.next(<any>{
                    currentPoints: 110,
                    minPointsReqForRedeem: 100,
                    cashbackCurrency: 'EUR',
                    cashbackAmount: 10,
                    optinStatus: true,
                });
                expect(component.isCompleted).toBeTrue();
            });
        });
    });

    describe('CasinoCashbackTileComponent', () => {
        beforeEach(() => {
            accountMenuServiceMock.resources.messages['CasinoCashbackDescriptionOptin'] = 'opt in';
            accountMenuServiceMock.resources.messages['CasinoCashbackDescriptionMinimum'] = 'Collect {MINIMUM_CASHBACK_AMOUNT}';
            accountMenuServiceMock.resources.messages['CasinoCashbackDescriptionAvailable'] = 'Available';
            accountMenuServiceMock.resources.messages['CashbackMinimumCollection'] = '{MIN_COLLECTION}';
            accountMenuServiceMock.resources.messages['CashbackLeft'] = '{LEFT}';
        });

        describe('init', () => {
            it('should show opt in message', () => {
                initComponent(CasinoCashbackTileComponent);
                const component = fixture.componentInstance as CasinoCashbackTileComponent;

                expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                    {
                        'LoadedEvent.component.PositionEvent': 'test',
                    },
                    'LoadedEvent',
                );

                accountMenuServiceMock.loyaltyCashbackEvents.next({
                    optinStatus: false,
                    cashbackAmount: 0,
                    cashbackCurrency: 'EUR',
                    minEligibleAmount: 1,
                    minEligibleAmountCurrency: 'EUR',
                });
                expect(component.text).toBeUndefined();
                expect(component.isCompleted).toBeFalsy();
                expect(component.description).toBe('opt in');
                expect(component.chartSegments).toBeUndefined();
                expect(accountMenuServiceMock.updateLoyaltyCashback).toHaveBeenCalled();
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'no opt-in',
                });
                expect(component.hideSkeleton).toBeTrue();
            });

            it('should init values for cashback when minimum not met', () => {
                intlServiceMock.formatCurrency.withArgs(20, 'EUR').and.returnValue('20 EUR');
                intlServiceMock.formatCurrency.withArgs(100, 'EUR').and.returnValue('100 EUR');
                intlServiceMock.formatCurrency.withArgs(80, 'EUR').and.returnValue('80 EUR');
                initComponent(CasinoCashbackTileComponent);
                const component = fixture.componentInstance as CasinoCashbackTileComponent;

                accountMenuServiceMock.loyaltyCashbackEvents.next({
                    optinStatus: true,
                    cashbackAmount: 20,
                    cashbackCurrency: 'EUR',
                    minEligibleAmount: 100,
                    minEligibleAmountCurrency: 'EUR',
                });
                expect(component.text).toBe('20');
                expect(component.isCompleted).toBeFalsy();
                expect(component.description).toBe('Collect 100 EUR');
                expect(component.chartSegments).toEqual([{ percent: 20 }]);
                expect(accountMenuServiceMock.updateLoyaltyCashback).toHaveBeenCalled();
                expect(component.cashbackAmount).toBe('20 EUR');
                expect(component.minCollection).toBe('100 EUR');
                expect(component.left).toBe('80 EUR');
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'no collectable cash',
                });
            });

            it('should init values and be available', () => {
                initComponent(CasinoCashbackTileComponent);
                const component = fixture.componentInstance as CasinoCashbackTileComponent;

                accountMenuServiceMock.loyaltyCashbackEvents.next({
                    optinStatus: true,
                    cashbackAmount: 100,
                    cashbackCurrency: 'EUR',
                    minEligibleAmount: 100,
                    minEligibleAmountCurrency: 'EUR',
                });
                expect(component.text).toBe('100');
                expect(component.isCompleted).toBeTrue();
                expect(component.description).toBe('Available');
                expect(component.chartSegments).toEqual([{ percent: 100 }]);
                expect(accountMenuServiceMock.updateLoyaltyCashback).toHaveBeenCalled();
                expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                    'component.PositionEvent': 'collectable cash',
                });
            });
        });
    });

    describe('ChatBubbleComponent', () => {
        describe('isAvailable', () => {
            let component: ChatBubbleComponent;
            let serverData: {
                isAvailable: boolean;
                isWithinServiceHours: boolean;
                isOpen?: boolean;
            };

            beforeEach(() => {
                serverData = {
                    isAvailable: true,
                    isWithinServiceHours: true,
                    isOpen: false,
                };

                initComponent(ChatBubbleComponent);
                component = fixture.componentInstance as ChatBubbleComponent;

                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });
            });

            it('should be true when isAvailable and not isOpen', () => {
                expect(component.isAvailable).toBeTrue();
            });

            it('should be false when isAvailable and isOpen', () => {
                serverData.isOpen = true;
                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });

                expect(component.isAvailable).toBeFalse();
            });

            it('should be false when not isAvailable and not isOpen', () => {
                serverData.isAvailable = false;
                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });

                expect(component.isAvailable).toBeFalse();
            });

            it('should be true when isAvailable, isWithinServiceHours, checkWorkingHours and not isOpen', () => {
                item.parameters.checkWorkingHours = 'true';
                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });

                expect(component.isAvailable).toBeTrue();
            });

            it('should be false when isAvailable, checkWorkingHours, not isWithinServiceHours and not isOpen', () => {
                item.parameters.checkWorkingHours = 'true';
                serverData.isWithinServiceHours = false;
                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });

                expect(component.isAvailable).toBeFalse();
            });

            it('should be true when isAvailable, not isWithinServiceHours, not checkWorkingHours and not isOpen', () => {
                item.parameters.checkWorkingHours = 'false';
                serverData.isWithinServiceHours = false;
                eventsServiceMock.event.set({ eventName: VanillaEventNames.ChatUpdate, data: serverData });

                expect(component.isAvailable).toBeTrue();
            });
        });
    });

    describe('HeaderInboxComponent', () => {
        beforeEach(() => {
            TestBed.overrideComponent(HeaderInboxComponent, {
                set: {
                    imports: [CommonModule],
                    providers: [TooltipsConfigMock],
                    schemas: [NO_ERRORS_SCHEMA],
                },
            });
        });
        describe('init', () => {
            it('should set newMessagesCount and newMessagesText', () => {
                item.resources['NewMessagesText'] = '_COUNT_ NEW';

                initComponent(HeaderInboxComponent);
                const component = fixture.componentInstance as HeaderInboxComponent;

                inboxServiceMock.whenReady.next();
                inboxServiceMock.count.next(5);

                expect(component.newMessagesCount).toBe(5);
                expect(component.newMessagesText).toBe('5 NEW');
            });
        });
    });

    describe('RowLayoutComponent', () => {
        describe('isActive()', () => {
            it('return whether the item is active', () => {
                initComponent(RowLayoutComponent);
                const component = fixture.componentInstance as RowLayoutComponent;

                menuItemsServiceMock.isActive.withArgs('Menu', 'name').and.returnValue(true);
                expect(component.isActive()).toBeTrue();

                menuItemsServiceMock.isActive.withArgs('Menu', 'name').and.returnValue(false);
                expect(component.isActive()).toBeFalse();
            });
        });
    });

    describe('BalanceTileItemComponent', () => {
        describe('init', () => {
            it('return whether the item is active', () => {
                item.parameters['balance'] = 'b';
                const balanceSubject: Observable<number> = new Subject();
                dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(balanceSubject);

                initComponent(BalanceTileItemComponent);
                const component = fixture.componentInstance as BalanceTileItemComponent;

                expect(component.balance).toBe(balanceSubject);
            });
        });
    });

    describe('BonusesTileComponent', () => {
        beforeEach(() => {
            item.resources = {
                NewBonusesText: 'New bonuses',
                NewBonusesDescription: 'Bonuses description',
                NoNewBonusesDescription: 'No new bonuses',
                NoNewBonusesText: 'Available bonuses',
            };
        });

        describe('init', () => {
            it('should set count, text and description', () => {
                initComponent(BonusesTileComponent);
                const component = fixture.componentInstance as BonusesTileComponent;

                expect(component.count).toBe(0);
                expect(component.text).toBe('Available bonuses');
                expect(component.description).toBe('No new bonuses');
            });

            describe('should react on offers count change', () => {
                it('should set count to 5', () => {
                    offersServiceMock.getCount.withArgs('ALL').and.returnValue(5);

                    initComponent(BonusesTileComponent);
                    const component = fixture.componentInstance as BonusesTileComponent;

                    offersServiceMock.counts.next([{ key: 'ALL', value: 5 }]);

                    expect(component.count).toBe(5);
                    expect(component.text).toBe('New bonuses');
                    expect(component.description).toBe('Bonuses description');
                });

                it('should set count to 0', () => {
                    offersServiceMock.getCount.withArgs('ALL').and.returnValue(0);

                    initComponent(BonusesTileComponent);
                    const component = fixture.componentInstance as BonusesTileComponent;

                    offersServiceMock.counts.next([{ key: 'ALL', value: 0 }]);

                    expect(component.count).toBe(0);
                    expect(component.text).toBe('Available bonuses');
                    expect(component.description).toBe('No new bonuses');
                });
            });
        });
    });

    describe('AccountMenuBalanceHeaderItemComponent', () => {
        describe('init', () => {
            it('should refresh bonus balance', () => {
                item.parameters['main-balance'] = 'true';
                item.parameters['formula'] = 'DSL.HeaderBalance';

                initComponent(AccountMenuBalanceHeaderItemComponent);
                const component = fixture.componentInstance as AccountMenuBalanceHeaderItemComponent;

                expect(component.mainBalance).toBeTrue();
                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('DSL.HeaderBalance');
            });

            it('processClick', () => {
                initComponent(AccountMenuBalanceHeaderItemComponent);
                const event = new Event('click');

                fixture.componentInstance.processClick(event, item);

                expect(accountMenuServiceMock.setActiveItem).toHaveBeenCalledWith(item.name);
                expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Menu');
            });
        });
    });

    describe('HeaderCloseComponent', () => {
        describe('close', () => {
            it('should refresh bonus balance', () => {
                initComponent(HeaderCloseComponent);
                const component = fixture.componentInstance as HeaderCloseComponent;

                component.close();

                expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false, { closedWithButton: true });
            });
        });
    });

    describe('IconMenuComponent', () => {
        let component: IconMenuComponent;

        beforeEach(() => {
            initComponent(IconMenuComponent);
            component = fixture.componentInstance;
        });

        describe('ngAfterViewInit', () => {
            beforeEach(() => {
                accountMenuServiceMock.version = 3;
                accountMenuDataServiceMock.routerMode = true;
                component.ngAfterViewInit();
            });

            it('should set drawer position', fakeAsync(() => {
                accountMenuDrawerServiceMock.resetDrawerPosition.next();

                expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function));
                tick();

                expect(accountMenuDrawerServiceMock.setDrawerPosition).toHaveBeenCalledOnceWith({
                    position: DrawerPosition.Middle,
                    height: 50,
                    isAutomaticallyOpened: true,
                });
            }));

            it('should reset drawer on route change', fakeAsync(() => {
                accountMenuRouterMock.currentRoute.next({ item, children: new Map<string, MenuRoute>(), parent: null });
                tick();

                expect(accountMenuDrawerServiceMock.resetDrawer).toHaveBeenCalled();
            }));
        });

        describe('onTouchEnd', () => {
            it('should update drawer position', fakeAsync(() => {
                component.linkContainer = <ElementRef>{ nativeElement: { scrollTop: 0, style: {} } };
                component.onTouchEnd({ deltaY: 50 });
                expect(accountMenuTasksServiceMock.expanded).toBeFalse();
                expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function));

                tick();

                expect(elementRepositoryServiceMock.get).toHaveBeenCalledOnceWith(VanillaElements.ACCOUNT_MENU_TASKS_ANCHOR);
                expect(accountMenuDrawerServiceMock.setDrawerPosition).toHaveBeenCalledOnceWith({
                    position: DrawerPosition.Bottom,
                    height: 50,
                });
            }));

            it('should NOT update drawer position if below swipe threshold', () => {
                const spy = spyOn(component, 'setNextHeight');
                component.onTouchEnd({ deltaY: 24 });

                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('getIcon', () => {
            it('should return direction based on drawer position', () => {
                expect(component.getIcon(DrawerPosition.Bottom)).toBe('up');
                expect(component.getIcon(DrawerPosition.Middle)).toBe('down');
            });
        });
    });
});
