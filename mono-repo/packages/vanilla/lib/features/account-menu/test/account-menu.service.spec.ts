import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { DynamicComponentsRegistry, NativeEventType, VanillaElements, VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { AccountMenuOverlayComponent } from '../src/account-menu-overlay.component';
import { INITIAL_ROUTE } from '../src/account-menu-tokens';
import { AccountMenuService } from '../src/account-menu.service';
import { AccountMenuDataServiceMock } from './account-menu-data.mock';
import { AccountMenuDrawerServiceMock } from './account-menu-drawer.service.mock';
import { AccountMenuResourceServiceMock } from './account-menu-resource.mock';
import { AccountMenuTrackingServiceMock } from './account-menu-tracking.mock';
import { DomChangeServiceMock } from './dom-change.mock';
import { MenuItemsServiceMock } from './menu-items.mock';

class SampleComponent {}

describe('AccountMenuService', () => {
    let service: AccountMenuService;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let loggerMock: LoggerMock;
    let isVisible: boolean;
    let navigationServiceMock: NavigationServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let overlayMock: OverlayFactoryMock;
    let mediaMock: MediaQueryServiceMock;
    let elementRepositoryServiceMock: ElementRepositoryServiceMock;
    let domChangeServiceMock: DomChangeServiceMock;
    let overlayRef: OverlayRefMock;
    let fakeAnchorElement: HtmlElementMock;
    let fakeCustomAnchorElement: HtmlElementMock;
    let fakeAuthHeaderSection: HtmlElementMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;
    let pageMock: PageMock;
    let eventsServiceMock: EventsServiceMock;
    let accountMenuDrawerServiceMock: AccountMenuDrawerServiceMock;
    let expectedConfig: { panelClass: string[]; positionStrategy: MockPositionStrategies };

    beforeEach(() => {
        loggerMock = MockContext.useMock(LoggerMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        mediaMock = MockContext.useMock(MediaQueryServiceMock);
        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        domChangeServiceMock = MockContext.useMock(DomChangeServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        pageMock = MockContext.useMock(PageMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        accountMenuDrawerServiceMock = MockContext.useMock(AccountMenuDrawerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuService, DynamicComponentsRegistry],
        });

        accountMenuDataServiceMock.content.next(<any>{
            name: 'main',
            menuRoute: 'menu',
            children: [
                {
                    name: 'myaccount',
                    menuRoute: 'menu/account',
                    children: [
                        {
                            name: 'settings',
                            menuRoute: 'menu/account/settings',
                        },
                    ],
                },
                {
                    name: 'mygame',
                    menuRoute: 'menu/game',
                },
            ],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
        expectedConfig = {
            panelClass: ['vn-account-menu-container'],
            positionStrategy: new MockPositionStrategies(),
        };

        fakeAnchorElement = new HtmlElementMock();
        fakeCustomAnchorElement = new HtmlElementMock();
        fakeAuthHeaderSection = new HtmlElementMock();

        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        elementRepositoryServiceMock.get.withArgs(VanillaElements.AVATAR_HEADER_ANCHOR).and.returnValue(fakeAnchorElement);
        elementRepositoryServiceMock.get.withArgs(VanillaElements.AUTH_HEADER_SECTION).and.returnValue(fakeAuthHeaderSection);
        elementRepositoryServiceMock.get.withArgs('customAnchor').and.returnValue(fakeCustomAnchorElement);

        pageMock.product = 'testweb';
    });

    describe('common', () => {
        beforeEach(() => {
            service = TestBed.inject(AccountMenuService);
            service.visible.subscribe((v) => (isVisible = v));
        });

        it('should expose resources', () => {
            accountMenuDataServiceMock.resources = { messages: { a: 'a' } };

            expect(service.resources).toEqual(accountMenuDataServiceMock.resources);
        });

        it('should expose vipLevels', () => {
            accountMenuDataServiceMock.vipLevels = [<any>{ a: 'a' }];

            expect(service.vipLevels).toEqual(accountMenuDataServiceMock.vipLevels);
        });

        describe('toggle', () => {
            it('should be off by default', () => {
                expect(isVisible).toBeFalse();
            });

            it('should send event', () => {
                service.toggle(true, { route: 'menu/account' });
                expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: VanillaEventNames.AccountMenuToggle, data: { show: true } });
            });

            it('should toggle on and set specified route', () => {
                service.toggle(true, { route: 'menu/account' });

                expectMenuStateChange(true);

                const portal: ComponentPortal<AccountMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                expect(portal.injector!.get(INITIAL_ROUTE)).toBe('menu/account');
            });

            it('should toggle off and set route to null', () => {
                service.toggle(true);
                expectMenuStateChange(true);

                service.toggle(false);
                expectMenuStateChange(false);
            });

            it('should create an overlay', () => {
                service.toggle(true);

                expectedConfig.positionStrategy.position = 'gt';

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
                expect(overlayRef.attach).toHaveBeenCalled();
                const portal: ComponentPortal<AccountMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                expect(portal.component).toBe(AccountMenuOverlayComponent);
                expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);

                expectMenuStateChange(true);
            });

            it('should create an overlay v2', () => {
                accountMenuDataServiceMock.version = 2;

                service.toggle(true);

                expectedConfig.positionStrategy.position = 'gtr';
                expectedConfig.panelClass.push('v2');

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
                expect(overlayRef.attach).toHaveBeenCalled();
                const portal: ComponentPortal<AccountMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                expect(portal.component).toBe(AccountMenuOverlayComponent);
                expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);

                expectMenuStateChange(true);
            });

            it('should position overlay to anchor on big screens', () => {
                accountMenuDataServiceMock.isDesktop = true;

                service.toggle(true);

                expectedConfig.positionStrategy.position = 'f';
                expectedConfig.positionStrategy.positions = [
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                ];
                expectedConfig.positionStrategy.push = false;
                expectedConfig.positionStrategy.flexDimensions = false;
                expectedConfig.positionStrategy.anchor = fakeAnchorElement;

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            });

            it('should position overlay to custom anchor on big screens when specified in ToggleOptions', () => {
                accountMenuDataServiceMock.isDesktop = true;

                service.toggle(true, { anchorElementKey: 'customAnchor' });

                expectedConfig.positionStrategy.position = 'f';
                expectedConfig.positionStrategy.positions = [
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                ];
                expectedConfig.positionStrategy.push = false;
                expectedConfig.positionStrategy.flexDimensions = false;
                expectedConfig.positionStrategy.anchor = fakeAnchorElement;

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            });

            it('should detach overlay on backdrop click', () => {
                service.toggle(true);

                overlayRef.backdropClick.next();

                expect(overlayRef.detach).toHaveBeenCalled();
            });

            it('should should dispose after detached and set visible to false', () => {
                service.toggle(true);

                overlayRef.detachments.next();

                expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
                expect(isVisible).toBeFalse();
            });

            it('should detach overlay when closed', () => {
                service.toggle(true);
                expectMenuStateChange(true);
                service.toggle(false);
                expectMenuStateChange(false);

                expect(overlayRef.detach).toHaveBeenCalled();
            });

            it('should not create an overlay if one is already open', () => {
                service.toggle(true);
                expectMenuStateChange(true);
                service.toggle(true);

                expect(overlayMock.create).toHaveBeenCalledTimes(1);
            });

            it('should allow to open an overlay after first one is closed', () => {
                service.toggle(true);
                expectMenuStateChange(true);
                service.toggle(false);
                expectMenuStateChange(false);
                service.toggle(true);
                expectMenuStateChange(true);

                expect(overlayMock.create).toHaveBeenCalledTimes(2);
            });

            describe('menu as route', () => {
                it('should close the menu when it is closed with button and navigate to return url', () => {
                    accountMenuDataServiceMock.routerModeReturnUrl = 'returnUrl';

                    service.toggle(false, {
                        closedWithButton: true,
                    });

                    expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                        eventName: NativeEventType.MENUCLOSED,
                        parameters: { product: 'testweb' },
                    });
                    expect(navigationServiceMock.goTo).toHaveBeenCalledWith('returnUrl');
                    expect(accountMenuDataServiceMock.removeReturnUrlCookie).toHaveBeenCalledWith();
                });

                it('should not close the menu when it is not closed with button', () => {
                    accountMenuDataServiceMock.routerModeReturnUrl = 'returnUrl';

                    service.toggle(false);

                    expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalledWith({
                        eventName: NativeEventType.MENUCLOSED,
                        parameters: { product: 'testweb' },
                    });
                    expect(navigationServiceMock.goTo).not.toHaveBeenCalledWith('returnUrl');
                    expect(accountMenuDataServiceMock.removeReturnUrlCookie).not.toHaveBeenCalledWith();
                });
            });
        });

        describe('media change', () => {
            it('should update overlay position if changed to large screen from small screen while menu is open', () => {
                service.toggle(true);

                accountMenuDataServiceMock.isDesktop = true;

                mediaMock.observe.next();
                overlayMock.position.position = '';
                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        position: 'f',
                        anchor: fakeAnchorElement,
                    }),
                );
            });

            it('should update overlay position if changed to small screen from large screen while menu is open', () => {
                service.toggle(true);

                accountMenuDataServiceMock.isDesktop = false;

                mediaMock.observe.next();
                overlayMock.position.position = '';
                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(jasmine.objectContaining({ position: 'gt' }));
            });

            it('should not reposition overlay if its not open in the first place', () => {
                expect(mediaMock.observe).not.toHaveBeenCalled();

                service.toggle(true);
                expectMenuStateChange(true);
                service.toggle(false);
                expectMenuStateChange(false);

                mediaMock.observe.next();

                expect(overlayRef.updatePositionStrategy).not.toHaveBeenCalled();
            });

            it('should update overlay position if an anchor is recreated while menu is open in large screen', () => {
                accountMenuDataServiceMock.isDesktop = true;
                service.toggle(true);

                expect(domChangeServiceMock.observe).toHaveBeenCalledWith(fakeAuthHeaderSection);

                const newAnchor = new HtmlElementMock();
                elementRepositoryServiceMock.get.withArgs(VanillaElements.AVATAR_HEADER_ANCHOR).and.returnValue(newAnchor);
                overlayMock.position.position = '';

                domChangeServiceMock.observe.next({
                    addedNodes: [
                        {
                            nodeType: 1,
                            innerHTML: '<div class="account-menu-anchor></div>"',
                        },
                    ],
                });

                expect(overlayRef.updatePositionStrategy).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        position: 'f',
                        anchor: newAnchor,
                    }),
                );
            });

            it('should not update overlay position if an anchor is recreated while menu is open in small screen', () => {
                service.toggle(true);

                expect(domChangeServiceMock.observe).toHaveBeenCalledWith(fakeAuthHeaderSection);

                domChangeServiceMock.observe.next({
                    addedNodes: [
                        {
                            nodeType: 1,
                            innerHTML: '<div class="account-menu-anchor></div>"',
                        },
                    ],
                });

                expect(overlayRef.updatePositionStrategy).not.toHaveBeenCalled();
            });
        });

        it('should not log warning if there are no items with the same name', () => {
            expect(loggerMock.warn).not.toHaveBeenCalled();
        });

        describe('setItemCounter()', () => {
            it('should set item counter', () => {
                service.setItemCounter('myaccount', 5, 'red');

                expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('Menu', 'myaccount', 5, 'red');
            });
        });

        describe('setActiveItem()', () => {
            it('should set active item', () => {
                service.setActiveItem('myaccount');

                expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith('Menu', 'myaccount');
            });
        });

        describe('menu item templates', () => {
            it('should allow to set menu item templates', () => {
                service.setAccountMenuComponent('type', SampleComponent);

                expect(service.getAccountMenuComponent('type')).toBe(SampleComponent);
            });

            it('should allow to set default item template', () => {
                service.setAccountMenuComponent('default', SampleComponent);

                expect(service.getAccountMenuComponent(undefined)).toBe(SampleComponent);
            });
        });

        describe('routerMode', () => {
            beforeEach(() => {
                accountMenuDataServiceMock.routerMode = true;

                navigationServiceMock.location.absUrl.and.returnValue('currentUrl');
            });

            describe('toggle()', () => {
                it('should open menu by navigating to a menu route, and store returnUrl', () => {
                    service.toggle(true);

                    expect(accountMenuDataServiceMock.setReturnUrlCookie).toHaveBeenCalledWith('currentUrl');
                    expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/menu/');
                });

                it('should reset drawer state', () => {
                    service.toggle(true);

                    expect(accountMenuDrawerServiceMock.resetDrawer).toHaveBeenCalled();
                });

                it('should close the menu by going to the return url and invoke native event', () => {
                    accountMenuDataServiceMock.routerModeReturnUrl = 'returnUrl';

                    service.toggle(false);

                    expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                        eventName: NativeEventType.MENUCLOSED,
                        parameters: { product: 'testweb' },
                    });
                    expect(navigationServiceMock.goTo).toHaveBeenCalledWith('returnUrl');
                    expect(accountMenuDataServiceMock.removeReturnUrlCookie).toHaveBeenCalledWith();
                });
            });

            describe('routerModeReturnUrl', () => {
                it('should return url from cookie', () => {
                    accountMenuDataServiceMock.routerModeReturnUrl = 'returnUrl';

                    expect(service.routerModeReturnUrl).toBe('returnUrl');
                });
            });
        });

        describe('tracking', () => {
            it('toggle(true) should track opening menu if routerMode is false', () => {
                service.toggle(true);

                expectOpeningWasTracked();
            });

            it('toggle(true) should track opening menu if routerMode is true', () => {
                accountMenuDataServiceMock.routerMode = true;

                service.toggle(true);
            });

            function expectOpeningWasTracked() {
                expect(accountMenuTrackingServiceMock.trackOpen).toHaveBeenCalled();
            }
        });

        describe('hierarchy', () => {
            it('should return menu hierarchy from data service', () => {
                const hierarchy = { h: 1 };
                accountMenuDataServiceMock.hierarchy = hierarchy;

                expect(service.hierarchy).toEqual(hierarchy);
            });
        });

        describe('version', () => {
            it('should return if menu uses v2', () => {
                accountMenuDataServiceMock.version = 2;

                expect(service.version).toBe(2);
            });
        });

        describe('update resources', () => {
            it('should trigger event on updateMLifeProfile', () => {
                spyOn(service.mLifeProfileEvents, 'next');
                const mLife = { tier: 'B', tierCredits: 3200, mlifeNo: 123123, tierDesc: 'Sapphire' };
                accountMenuResourceServiceMock.getMlifeProfile.and.returnValue(of(mLife));

                service.updateMLifeProfile();

                expect(accountMenuResourceServiceMock.getMlifeProfile).toHaveBeenCalled();
                expect(service.mLifeProfileEvents.next).toHaveBeenCalledWith(mLife);
            });
            it('should trigger event on updatePokerCashback', () => {
                spyOn(service.pokerCashbackEvents, 'next');
                const pokerCashback = {
                    hasOptedIn: true,
                    pointsRequiredForNextSlab: 80,
                    isOptin: 'Y',
                    weeklyPoints: 300,
                    nextSlabPoints: 500,
                    currency: 'EUR',
                    targetCashback: 'Target',
                    awardType: 'Poker_dollars',
                };

                accountMenuResourceServiceMock.getPokerCashback.and.returnValue(of(pokerCashback));

                service.updatePokerCashback();
                expect(accountMenuResourceServiceMock.getPokerCashback).toHaveBeenCalled();
                expect(service.pokerCashbackEvents.next).toHaveBeenCalledWith(pokerCashback);
            });
            it('should trigger event on updateCoralCashback', () => {
                spyOn(service.coralCashbackEvents, 'next');
                const coralCashback = {
                    optinStatus: true,
                    cashbackAmount: 123,
                    cashbackCurrency: 'abc',
                    eligibleForClaim: true,
                    claimedAmount: 123,
                    claimedAmountCurrency: 'EUR',
                    currentPoints: 123,
                    lifeTimePoints: 123,
                    pointsBalanceAfterClaim: 123,
                    minPointsReqForRedeem: 123,
                };
                accountMenuResourceServiceMock.getCoralCashback.and.returnValue(of(coralCashback));

                service.updateCoralCashback();

                expect(accountMenuResourceServiceMock.getCoralCashback).toHaveBeenCalled();
                expect(service.coralCashbackEvents.next).toHaveBeenCalledWith(coralCashback);
            });
            it('should trigger event on updateLoyaltyCashback', () => {
                spyOn(service.loyaltyCashbackEvents, 'next');
                const cashBack = {
                    optinStatus: true,
                    cashbackAmount: 123,
                    cashbackCurrency: 'EUR',
                    minEligibleAmount: 123,
                    minEligibleAmountCurrency: 'test',
                };

                accountMenuResourceServiceMock.getCashback.and.returnValue(of(cashBack));

                service.updateLoyaltyCashback();

                expect(accountMenuResourceServiceMock.getCashback).toHaveBeenCalled();
                expect(service.loyaltyCashbackEvents.next).toHaveBeenCalledWith(cashBack);
            });
        });

        function expectMenuStateChange(on: boolean) {
            if (on) {
                overlayRef.attachments.next();
            } else {
                overlayRef.detachments.next();
            }

            expect(isVisible).toBe(on);
        }
    });
});
