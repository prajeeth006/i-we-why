import { Injectable, Type, WritableSignal, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    DslService,
    DynamicComponentsRegistry,
    ElementRepositoryService,
    MenuContentItem,
    MenuItemsService,
    MenuSection,
    NavigationService,
    ResizeObserverService,
    VanillaDynamicComponentsCategory,
    VanillaElements,
} from '@frontend/vanilla/core';
import { MenuItemHighlightService } from '@frontend/vanilla/shared/menu-item';
import { BehaviorSubject, Observable, ReplaySubject, Subject, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import { HeaderConfig, HeaderConfigElements } from './header.client-config';

/**
 * @whatItDoes Provides utility functions for manipulating the header
 *
 * @description
 *
 * # Overview
 * This provides functionality for manipulating the header:
 *  - Get header height
 *  - Highlight product
 *  - show/hide
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class HeaderService {
    currentHighlightedProductName: string | null = null;

    readonly unauthItems = signal<MenuContentItem[] | null>(null);
    readonly productItems = signal<MenuContentItem[] | null>(null);
    readonly pillItems = signal<MenuContentItem[] | null>(null);
    readonly balance = signal<number | null>(null);
    readonly bonusBalance = signal<number | null>(null);
    readonly activeProduct = signal<MenuContentItem | null>(null);
    readonly headerVisible = signal<boolean>(false);
    readonly headerElementRect = signal<{ width: number; height: number }>({ width: 0, height: 0 });
    readonly headerComponentRect = signal<{ width: number; height: number }>({ width: 0, height: 0 });
    readonly hasHeaderElement = computed(() => this.headerComponentRect().width !== 0 || this.headerComponentRect().height !== 0);

    private highlightedProductEvents = new BehaviorSubject<MenuContentItem | null>(null);
    private headerDisplayEvents: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private disabledItems: string[] = [];

    /** @internal */
    get highlightedProduct(): Observable<MenuContentItem | null> {
        return this.highlightedProductEvents;
    }

    /** Observable of when the header is shown or hidden. Will instantly return current value to subscribers. */
    get display(): Observable<boolean> {
        return this.headerDisplayEvents;
    }

    get version(): number {
        return this.headerContent.version;
    }

    private readonly authItems$$ = new ReplaySubject<MenuContentItem[]>(1);
    readonly authItems$ = this.authItems$$.asObservable();

    // debounceTime prevents header flickering
    private readonly leftItems$$ = new ReplaySubject<MenuContentItem[]>(1);
    readonly leftItems$ = this.leftItems$$.asObservable().pipe(
        debounceTime(10),
        distinctUntilChanged((prev, current) => prev.every((item, index) => item.name === current[index]?.name)),
    );

    constructor(
        private resizeObserver: ResizeObserverService,
        private elementRepositoryService: ElementRepositoryService,
        private headerContent: HeaderConfig,
        private dslService: DslService,
        private menuItemsService: MenuItemsService,
        private navigationService: NavigationService,
        private dynamicComponentsRegistry: DynamicComponentsRegistry,
        private menuItemHighlightingService: MenuItemHighlightService,
    ) {
        this.elementRepositoryService.elements$
            .pipe(
                map((v) => v.get(VanillaElements.HEADER_SLOT)),
                distinctUntilChanged(),
                switchMap((element) => {
                    if (element) {
                        return this.resizeObserver
                            .observe(element)
                            .pipe(map((entry) => ({ width: entry.contentBoxSize[0]!.blockSize, height: entry.contentBoxSize[0]!.inlineSize })));
                    }
                    return of({ width: 0, height: 0 });
                }),
                takeUntilDestroyed(),
            )
            .subscribe((rect) => this.headerComponentRect.set(rect));
    }

    initMenuItems() {
        this.evaluateMenuContentItems('leftItems', this.leftItems$$);
        this.evaluateMenuContentItems('authItems', this.authItems$$);
        this.evaluateMenuContentItems('unauthItems', this.unauthItems);
        this.evaluateMenuContentItems('productItems', this.productItems);
        this.evaluateMenuContentItems('pillItems', this.pillItems);
        this.evaluateBalanceParams();
    }

    private evaluateMenuContentItems(key: keyof HeaderConfigElements, store: Subject<MenuContentItem[]> | WritableSignal<MenuContentItem[] | null>) {
        const items = this.headerContent.elements[key];

        if (items?.length > 0) {
            // preload the components needed for the header section
            items.forEach((item) => this.preload(item.type));

            this.dslService.evaluateContent(items).subscribe((items: MenuContentItem[]) => {
                store instanceof Subject ? store.next(items) : store.set(items);
            });
        }
    }

    private authItemBalanceParam(condition: (item: MenuContentItem) => boolean): Observable<number> {
        return this.authItems$$.pipe(
            startWith(this.headerContent.elements.authItems),
            map(
                (authItems: MenuContentItem[]) =>
                    authItems.find((authItem: MenuContentItem) => condition(authItem) && authItem?.parameters?.balance)?.parameters?.balance,
            ),
            distinctUntilChanged(),
            switchMap((balanceParam: string | undefined) => {
                if (balanceParam) {
                    return this.dslService.evaluateExpression<number>(balanceParam);
                }

                return of(0);
            }),
        );
    }

    private evaluateBalanceParams() {
        this.authItemBalanceParam((authItem: MenuContentItem) => authItem.type === 'avatar-balance' || authItem.type === 'balance').subscribe(
            (balance: number) => {
                this.balance.set(balance);
            },
        );
        this.authItemBalanceParam((authItem) => authItem.type === 'bonus-balance').subscribe((balance: number) => {
            this.bonusBalance.set(balance);
        });
    }

    initProductHighlighting() {
        this.menuItemHighlightingService.initHighlighting(this.headerContent.products);
        this.navigationService.locationChange.subscribe(() => this.setHighlightedProduct());
    }

    /**
     * Because the header is fixed and therefore obstructs the top of the page, sometimes it's needed to know it's
     * height (f.e. for scrolling calculations).
     *
     * ```
     * headerService.getHeaderHeight();
     * ```
     */
    getHeaderHeight(): number {
        return this.headerComponentRect().height;
    }

    /**
     * Overrides highlighted product in the product switcher. If null is provided, it will reset selected product to
     * current product.
     *
     * ```
     * headerService.highlightProduct('sports');
     * headerService.highlightProduct(null);
     * ```
     *
     * Rules for highlighting (first one that matches will be highlighted):
     *
     * - first item with `highlight-url-pattern` parameter that matches current location absolute path will be
     * highlighted
     * - first item without `highlight-url-pattern` whose `url` is an exact match for current location absolute path
     * will be highlighted
     * - if `HeaderService.highlightProduct(<product>)` is called, that product will be highlighted (if it exists)
     * until `HeaderService.highlightProduct(null)` is called.
     * - the item corresponding to `Page.product` will be highlighted (if it exists)
     * - nothing will be highlighted
     */
    highlightProduct(name: string | null) {
        this.currentHighlightedProductName = name;

        this.setHighlightedProduct();
    }

    /** Set a component type for header item type. */
    setHeaderComponent(itemType: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.Header, itemType, component);
    }

    // TODO: find all places where this is used and replace it with preload and get lazy component methods
    /** Gets a component type for header item type. */
    getHeaderComponent(itemType: string | undefined): Type<any> | null {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.Header, itemType || 'button');
    }

    registerLazyCmp(itemType: string, lazyImportFn: () => Promise<Type<any>>) {
        this.dynamicComponentsRegistry.registerLazyComponent(VanillaDynamicComponentsCategory.Header, itemType, lazyImportFn);
    }

    /** Gets a lazy component type for header item type. */
    getLazyComponent(itemType: string | undefined): Promise<Type<any> | null> {
        return this.dynamicComponentsRegistry.getLazyComponent(VanillaDynamicComponentsCategory.Header, itemType || 'button');
    }

    /** Preload lazy component */
    preload(itemType: string) {
        this.dynamicComponentsRegistry.preloadLazyComponent(VanillaDynamicComponentsCategory.Header, itemType);
    }

    /** Assigns a number to be shown as a counter for a header item. */
    setItemCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.Header, itemName, count, cssClass);
    }

    /** Shows the header. List of items to be disabled can be passed. */
    show(disabledItems?: string[]) {
        this.headerDisplayEvents.next(true);
        this.headerVisible.set(true);
        this.disabledItems = disabledItems || [];
    }

    /** Hides the header. */
    hide() {
        this.headerDisplayEvents.next(false);
        this.headerVisible.set(false);
    }

    /** Checks if specific header element is disabled according to list on dynacon config.*/
    itemDisabled(item: string): boolean {
        return this.disabledItems.some((x) => x == item);
    }

    setHighlightedProduct() {
        const product = this.menuItemHighlightingService.setHighlightedProduct(this.headerContent.products, this.currentHighlightedProductName);

        if (product?.name) {
            this.menuItemHighlightingService.setActiveItem(MenuSection.Header, product.name);
        }

        this.highlightedProductEvents.next(product || null);
        this.activeProduct.set(product);
    }
}
