import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Type } from '@angular/core';

import {
    DomChangeService,
    DynamicComponentsRegistry,
    ElementRepositoryService,
    EventsService,
    GenericListItem,
    MediaQueryService,
    MenuContentItem,
    MenuItemsService,
    MenuSection,
    NativeAppService,
    NativeEventType,
    NavigationService,
    Page,
    ToggleMenuOptions,
    VanillaDynamicComponentsCategory,
    VanillaElements,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { BehaviorSubject, Observable, Subject, filter, skip, takeUntil } from 'rxjs';

import { AccountMenuDrawerService } from './account-menu-drawer.service';
import { AccountMenuOverlayComponent } from './account-menu-overlay.component';
import { AccountMenuResourceService } from './account-menu-resource.service';
import { INITIAL_ROUTE } from './account-menu-tokens';
import { AccountMenuTrackingService } from './account-menu-tracking.service';
import { CoralCashback, LoyaltyCashback, MLifeProfile, PokerCashback } from './account-menu.models';

/**
 * @whatItDoes Provides functionality to manipulate the account menu
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating the account menu:
 *  - Toggle the menu
 *  - Set counter for menu item
 *  - Set a template for rendering an item type
 *  - Navigate to a menu route
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class AccountMenuService {
    /** @internal */
    loyaltyCashbackEvents = new BehaviorSubject<LoyaltyCashback | null>(null);
    /** @internal */
    pokerCashbackEvents = new BehaviorSubject(<PokerCashback | null>null);
    /** @internal */
    coralCashbackEvents = new BehaviorSubject<CoralCashback | null>(null);
    /** @internal */
    mLifeProfileEvents = new BehaviorSubject<MLifeProfile | null>(null);

    private visibleEvents: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private currentRef: OverlayRef | null;
    private currentAnchorKey: string | undefined;
    private unsubscribe: Subject<void> | null;

    constructor(
        private page: Page,
        private navigationService: NavigationService,
        private menuItemsService: MenuItemsService,
        private overlay: OverlayFactory,
        private injector: Injector,
        private media: MediaQueryService,
        private elementRepositoryService: ElementRepositoryService,
        private accountMenuTrackingService: AccountMenuTrackingService,
        private domChangeService: DomChangeService,
        private accountMenuResourceService: AccountMenuResourceService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuDrawerService: AccountMenuDrawerService,
        private dynamicComponentsRegistry: DynamicComponentsRegistry,
        private nativeAppService: NativeAppService,
        private eventsService: EventsService,
    ) {}

    /** Observable of when main menu is shown or hidden. Will instantly return current value to subscribers. */
    get visible(): Observable<boolean> {
        return this.visibleEvents;
    }

    /** Indicates that the menu will operate in router mode (e.g. it will open as a route rather than overlay) */
    get routerMode(): boolean {
        return this.accountMenuDataService.routerMode;
    }

    get routerModeReturnUrl(): string {
        return this.accountMenuDataService.routerModeReturnUrl;
    }

    /** Translated strings from sitecore related to the account menu. */
    get resources(): GenericListItem {
        return this.accountMenuDataService.resources;
    }

    get vipLevels(): MenuContentItem[] {
        return this.accountMenuDataService.vipLevels;
    }

    get hierarchy(): any {
        return this.accountMenuDataService.hierarchy;
    }

    /** Indicates version used. */
    get version(): number {
        return this.accountMenuDataService.version;
    }

    /** Show or hide the menu. Optionally you can specify some ToggleMenuOptions. */
    toggle(show: boolean, toggleOptions?: ToggleMenuOptions) {
        this.eventsService.raise({ eventName: VanillaEventNames.AccountMenuToggle, data: { show: show } });
        const options = Object.assign({}, toggleOptions);

        this.accountMenuDataService.singlePageMode = !!options.singlePageMode;

        if (this.routerMode) {
            if (show) {
                if (this.version === 4 || this.version === 5) {
                    this.accountMenuTrackingService.trackOpen(this.version);
                }

                this.accountMenuDrawerService.resetDrawer();
                this.setReturnUrlCookie(this.navigationService.location.absUrl());
                this.navigationService.goTo(`/menu/${options.route || ''}`);
            } else {
                this.accountMenuTrackingService.trackClose(this.version);
                this.sendMenuClosedToNative();
                this.goToReturnUrl();
            }
        } else {
            if (show && !this.currentRef) {
                this.accountMenuTrackingService.trackOpen(this.version);

                this.currentAnchorKey = options.anchorElementKey;
                const positionStrategy = this.createPositionStrategy();
                const panelClasses = ['vn-account-menu-container'];

                if (this.version > 1) {
                    panelClasses.push(`v${this.version}`);
                }
                if (this.version === 3) {
                    panelClasses.push(`th-scroll`);
                }

                const overlayRef = this.overlay.create({
                    panelClass: panelClasses,
                    positionStrategy: positionStrategy,
                });
                overlayRef.backdropClick().subscribe(() => this.currentRef!.detach());
                overlayRef.detachments().subscribe(() => {
                    this.stopReactingToMediaChanges();
                    this.overlay.dispose(this.currentRef);
                    this.currentRef = null;
                    this.currentAnchorKey = undefined;
                    this.visibleEvents.next(false);
                });
                overlayRef.attachments().subscribe(() => {
                    this.visibleEvents.next(true);
                });

                const portal = new ComponentPortal(
                    AccountMenuOverlayComponent,
                    null,
                    Injector.create({
                        providers: [
                            { provide: OverlayRef, useValue: overlayRef },
                            { provide: INITIAL_ROUTE, useValue: options.route || 'menu' },
                        ],
                        parent: this.injector,
                    }),
                );
                overlayRef.attach(portal);

                this.currentRef = overlayRef;

                this.reactToMediaChanges();
            } else if (!show && this.currentRef) {
                this.currentRef.detach();
                if (options.closedWithButton) {
                    this.accountMenuTrackingService.trackClose(this.version);
                }
            } else if (!show && options.closedWithButton) {
                /* Menu opened as a route:
                - closed with button - then send native event to apps so that they can close the web view.
                - closed by navigating to link from account menu - don't send native event.
            */
                this.accountMenuTrackingService.trackClose(this.version);
                this.sendMenuClosedToNative();
                this.goToReturnUrl();
            }
        }
    }

    /** Assigns a number to be shown as a counter for a menu item. */
    setItemCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.Menu, itemName, count, cssClass);
    }

    /** Sets a menu item as active. */
    setActiveItem(itemName: string) {
        this.menuItemsService.setActive(MenuSection.Menu, itemName);
    }

    /** Updates poker cashback */
    updatePokerCashback() {
        this.accountMenuResourceService.getPokerCashback().subscribe((d: PokerCashback) => this.pokerCashbackEvents.next(d));
    }

    /** Updates casino cashback */
    updateLoyaltyCashback() {
        this.accountMenuResourceService.getCashback().subscribe((d: LoyaltyCashback) => this.loyaltyCashbackEvents.next(d));
    }

    /** Updates coral cashback */
    updateCoralCashback() {
        this.accountMenuResourceService.getCoralCashback().subscribe((d: CoralCashback) => this.coralCashbackEvents.next(d));
    }

    /** Updates mlife profile */
    updateMLifeProfile() {
        this.accountMenuResourceService.getMlifeProfile().subscribe((d: MLifeProfile) => this.mLifeProfileEvents.next(d));
    }

    /** Set a component type for menu item type. */
    setAccountMenuComponent(itemType: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.AccountMenu, itemType, component);
    }

    /** Gets a component type for menu item type. */
    getAccountMenuComponent(itemType: string | undefined) {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.AccountMenu, itemType || 'default');
    }

    /** Sets the menu's return url cookie to the supplied url value. */
    setReturnUrlCookie(url: string) {
        this.accountMenuDataService.setReturnUrlCookie(url);
    }

    /** Remove the menu return url cookie. */
    removeReturnUrlCookie() {
        this.accountMenuDataService.removeReturnUrlCookie();
    }

    private reactToMediaChanges() {
        if (this.version > 1) {
            return;
        }

        this.unsubscribe = new Subject();
        this.media
            .observe()
            .pipe(skip(1), takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.currentRef!.updatePositionStrategy(this.createPositionStrategy());
            });

        this.domChangeService
            .observe(this.elementRepositoryService.get(VanillaElements.AUTH_HEADER_SECTION)!)
            .pipe(
                takeUntil(this.unsubscribe),
                filter(
                    (m) =>
                        this.accountMenuDataService.isDesktop &&
                        Array.from(m.addedNodes).some((n) => n.nodeType == 1 && (<HTMLElement>n).innerHTML.includes('account-menu-anchor')),
                ),
            )
            .subscribe(() => {
                this.currentRef!.updatePositionStrategy(this.createPositionStrategy());
            });
    }

    private stopReactingToMediaChanges() {
        if (this.version > 1) {
            return;
        }

        this.unsubscribe?.next();
        this.unsubscribe?.complete();
        this.unsubscribe = null;
    }

    private createPositionStrategy(): GlobalPositionStrategy | FlexibleConnectedPositionStrategy {
        if (this.version > 1) {
            return this.overlay.position.global().top().right();
        }

        if (this.accountMenuDataService.isDesktop) {
            const anchor = this.elementRepositoryService.get(this.currentAnchorKey || VanillaElements.AVATAR_HEADER_ANCHOR)!;

            return this.overlay.position
                .flexibleConnectedTo(anchor)
                .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }])
                .withPush(false)
                .withFlexibleDimensions(false);
        }

        return this.overlay.position.global().top();
    }

    private goToReturnUrl() {
        const returnUrl = this.accountMenuDataService.routerModeReturnUrl || this.page.homePage;
        this.removeReturnUrlCookie();
        this.navigationService.goTo(returnUrl);
    }

    private sendMenuClosedToNative() {
        this.nativeAppService.sendToNative({ eventName: NativeEventType.MENUCLOSED, parameters: { product: this.page.product } });
    }
}
