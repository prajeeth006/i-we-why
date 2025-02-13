import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterContentInit, DestroyRef, Directive, ElementRef, Injector, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { Observable, auditTime, debounceTime, map, of, switchMap } from 'rxjs';

import { DsTab } from './tab.component';

/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const INITIAL_SCROLL_DELAY = 650; // ms

/**
 * For selected tab item the font weight is more text than the default state and there by in some cases
 * the right arrow is showing even when we scroll to last tab items due to increase of tab items width
 *
 * A small threshold (10px in this case) is introduced to detect minor changes
 * in the maxScrollLeft value. If the change is small enough (between 1px and 10px),
 * we assume that any last tab item is selected and there by we return true to hide right arrow.
 */
const SCROLL_THRESHOLD = 10;

@Directive()
export abstract class DsTabsArrows implements AfterContentInit {
    protected _injector = inject(Injector);
    protected _destroyRef = inject(DestroyRef);
    protected _breakpointObserver = inject(BreakpointObserver);

    abstract _id: number;

    abstract _scrollable: Signal<boolean>;
    abstract _activeTab: Signal<string>;

    protected abstract _tabs: Signal<DsTab[]>;
    abstract _tabHeaderItemsContainer: ElementRef<HTMLElement>;
    abstract _tabHeaderItemsList: ElementRef<HTMLUListElement>;

    isSmallScreen = toSignal(
        this._breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.HandsetLandscape, Breakpoints.TabletPortrait])
            .pipe(map((res) => res.matches)),
    );

    /** The distance in pixels that the tab labels should be translated to the left. */
    private _scrollDistanceToLeft = signal(0);
    abstract _scrollDistance: Signal<number>;
    abstract _scrollSpeed: Signal<string>;

    private _containerWidth = signal(0);
    private _listScrollWidth = signal(0);

    _maxScrollDistance = computed(() => this._listScrollWidth() - this._containerWidth() || 0);

    // Whether the tab list can be scrolled to the left.
    showNavigationArrows = computed(() => {
        if (!this._scrollable()) {
            return false;
        }
        if (this.isSmallScreen()) {
            return false;
        }
        if (this._containerWidth() === 0) {
            return false;
        }
        if (!this.initialScrollHappened()) {
            return false; // don't show arrows until the initial scroll is fired
        }
        return this._listScrollWidth() > this._containerWidth();
    });

    addMobileNavScrollClass = computed(() => {
        if (!this._scrollable()) {
            return false;
        }
        return this.isSmallScreen();
    });

    // If the header is at the beginning of the list (scroll distance is equal to 0) then disable the prev button.
    prevBtnHidden = computed(() => this._scrollDistanceToLeft() === 0);

    // If the header is at the end of the list (scroll distance is equal to the maximum distance we can scroll),
    // then disable the after button.
    nextBtnHidden = computed(() => {
        if (Math.abs(this._scrollDistanceToLeft() - this._maxScrollDistance()) <= SCROLL_THRESHOLD) {
            return true;
        }
        return Math.ceil(this._scrollDistanceToLeft()) === Math.ceil(this._maxScrollDistance());
    });

    initialScrollHappened = signal(false);

    ngAfterContentInit() {
        toObservable(this._activeTab, { injector: this._injector })
            .pipe(
                switchMap((activeTab) => {
                    if (this.initialScrollHappened()) {
                        return of(activeTab);
                    }
                    return of(activeTab).pipe(auditTime(INITIAL_SCROLL_DELAY));
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe((activeTab) => {
                this.initialScrollHappened.set(true);
                this._updateScrollDistanceBasedOnName(activeTab);
            });

        const containerWidthSub = listenToResizeObserver([this._tabHeaderItemsContainer.nativeElement], this._injector).subscribe((res) => {
            this._containerWidth.set(res.length > 0 ? res[0].contentRect.width : 0);
        });

        const listItemsWidthSub = listenToResizeObserver([this._tabHeaderItemsList.nativeElement], this._injector).subscribe((res) => {
            if (this._scrollable()) {
                this._listScrollWidth.set(res.length > 0 ? res[0].contentRect.width : 0);
            } else {
                this._listScrollWidth.set(0);
            }
        });

        this._destroyRef.onDestroy(() => {
            containerWidthSub.unsubscribe();
            listItemsWidthSub.unsubscribe();
        });
    }

    /**
     * Handles click events on the tab list. Moves the header to the clicked tab.
     * @param event
     * @param direction
     */
    handleArrowClick(event: MouseEvent, direction: 'prev' | 'next') {
        const scrollAmount = (direction === 'prev' ? -1 : 1) * this._scrollDistance();

        return this._scrollTo(this._scrollDistanceToLeft() + scrollAmount);
    }

    /**
     * Scrolls the header to a given position.
     * @param position Position to which to scroll.
     * @returns Information on the current scroll distance and the maximum.
     */
    private _scrollTo(position: number) {
        const distance = Math.max(0, Math.min(this._maxScrollDistance(), position));
        this._scrollDistanceToLeft.set(distance);
        this._updateTabScrollPosition(distance);
    }

    /**
     * Updates the scroll distance of the tab list based on the selected name.
     * @param name
     */
    _updateScrollDistanceBasedOnName(name: string) {
        if (!this._scrollable()) {
            return;
        }

        const tabs = this._tabs();

        const selectedTab = tabs.find((x) => x.name() === name);

        if (tabs.length === 0 || !selectedTab) {
            return;
        }

        const tabHeaderItem = this._getTabElementByName(name);

        if (!tabHeaderItem) {
            return;
        }
        // calculate the scroll distance
        const scrollDistance = _calculateScrollDistance(this._tabHeaderItemsContainer.nativeElement, tabHeaderItem);
        if (this.showNavigationArrows()) {
            if (name === tabs[0].name()) {
                this._scrollTo(0);
                return;
            }

            // eslint-disable-next-line unicorn/prefer-at
            if (tabs[tabs.length - 1].name() === name) {
                this._scrollTo(this._maxScrollDistance());
                return;
            }

            if (tabHeaderItem && scrollDistance) {
                this._scrollTo(scrollDistance);
            }
        } else if (tabHeaderItem && this._tabHeaderItemsContainer.nativeElement.scrollTo) {
            /**
             * offsetRectLeft: This gives the left position of the tabElement relative to the viewport
             */
            const { left: offsetRectLeft } = tabHeaderItem.getBoundingClientRect();

            /**
             * This gets the position of the container (the scrollable area where the tabs are displayed) from the left side of the viewport.
             * Example: If the container is 30px from the left side of the viewport, this would be 30.
             */
            const { left: containerOffsetRectLeft } = this._tabHeaderItemsContainer.nativeElement.getBoundingClientRect();

            /**
             * _tabHeaderItemsContainer scrollLeft: This gets the current horizontal scroll position of the container.
             * It helps to ensure that we calculate the new scroll position relative to the current one.
             * Example: If the container has been scrolled 100px to the right, container.scrollLeft would return 100.
             */
            const containerScrollLeft = this._tabHeaderItemsContainer.nativeElement.scrollLeft;

            /**
             * container.clientWidth gives the total width of the container's visible area.
             * tabElement.clientWidth gives the width of the tab element.
             * The difference between the two (container.clientWidth - tabElement.clientWidth) gives the remaining space on either side of the tab. Dividing this by 2 distributes the extra space equally on both sides to center the tab.
             * Example: If the container's width is 600px and the tab's width is 100px, the result is (600 - 100) / 2 = 250px.
             * This value ensures the tab is positioned in the center of the container.
             */
            const targetScroll =
                containerScrollLeft +
                offsetRectLeft -
                containerOffsetRectLeft -
                (this._tabHeaderItemsContainer.nativeElement.clientWidth - tabHeaderItem.clientWidth) / 2;

            // Scroll into view centered
            this._tabHeaderItemsContainer.nativeElement.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    }

    _getTabElementByName(name: string): HTMLElement | null {
        // [id]="'ds-tab-id-' + id + '-' + $name"
        const id = `#ds-tab-id-${this._id}-${name}`;
        return this._tabHeaderItemsList.nativeElement.querySelector(id);
    }

    /**
     * Updates the tab list scroll position to move the active tab into view.
     * @param scrollDistance
     */
    _updateTabScrollPosition(scrollDistance: number) {
        let distance = 0;

        if (this.showNavigationArrows()) {
            if (!this._tabHeaderItemsContainer || !this._tabHeaderItemsList) {
                return;
            }
            distance = -scrollDistance;
        } else {
            distance = 0;
        }

        // if we show the navigation arrows we want to scroll it based on the distance provided otherwise keep it at 0;
        this._tabHeaderItemsList.nativeElement.style.transform = `translateX(${Math.round(distance)}px)`;
    }
}

/**
 * Calculates the scroll distance based on a selected element.
 */
function _calculateScrollDistance(containerElement: HTMLElement, tabHeaderItem: HTMLElement): number | undefined {
    const { left: offsetRectLeft, right: offsetRectRight } = tabHeaderItem.getBoundingClientRect();
    // TODO: Make this faster, cache containerElement.getBoundingClientRect()
    const { left: containerOffsetRectLeft, right: containerOffsetRectRight } = containerElement.getBoundingClientRect();
    const { offsetLeft, offsetWidth } = tabHeaderItem;
    const { offsetLeft: containerOffsetLeft, offsetWidth: containerWidth } = containerElement;

    let containerCenterPosition;
    // calculate target center position
    const targetCenterPosition = offsetLeft + offsetWidth / 2;
    // arrowSize size is taken by addition of arrow button width and max 8px padding to right and left
    const arrowSize = 32;
    if (offsetRectLeft < containerOffsetRectLeft + arrowSize || offsetRectRight > containerOffsetRectRight - arrowSize) {
        // calculate center of the container viewport
        return (containerCenterPosition = targetCenterPosition - (containerOffsetLeft + containerWidth / 2));
    }
    return containerCenterPosition;
}

/**
 * Listen to resize observer on a list of elements
 * @param elements
 * @param injector
 */
function listenToResizeObserver(elements: HTMLElement[], injector: Injector): Observable<ResizeObserverEntry[]> {
    const destroyRef = injector.get(DestroyRef);

    const resizeObservable = new Observable<ResizeObserverEntry[]>((observer) => {
        const resizeObserver = new ResizeObserver((res) => {
            observer.next(res);
        });

        for (const el of elements) {
            resizeObserver.observe(el);
        }

        return () => {
            resizeObserver.disconnect();
        };
    });

    // We need to debounce resize events because the alignment logic is expensive.
    // If someone animates the width of tabs, we don't want to realign on every animation frame.
    // Once we haven't seen any more resize events in the last 32ms (~2 animation frames) we can
    // re-align.
    return resizeObservable.pipe(debounceTime(32), takeUntilDestroyed(destroyRef));
}
