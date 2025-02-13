import { FocusMonitor } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    booleanAttribute,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DsTab } from './tab.component';
import { DsTabsScrollArrow } from './tabs-arrow.component';
import { DsTabsArrows } from './tabs-arrows';
import { DS_TAB_OPTIONS } from './tabs.token';
import { TabsGroupIndicatorType, TabsGroupSizesType, TabsGroupVariantsType } from './tabsgroup.types';

// eslint-disable-next-line functional/no-let
let uniqueTabId = 0;
function getTabId() {
    return ++uniqueTabId;
}

@Component({
    selector: 'ds-tabs-group',
    templateUrl: 'tabsgroup.component.html',
    host: {
        '[class]': `hostClass`,
        '[class.ds-tabs-inverse]': 'inverse',
    },
    imports: [NgTemplateOutlet, DsTabsScrollArrow],
    styleUrl: './tabsgroup.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTabsGroup extends DsTabsArrows implements AfterViewInit, AfterContentInit, OnDestroy {
    private tabOptions = inject(DS_TAB_OPTIONS);
    private _focusMonitor = inject(FocusMonitor);

    // Define scrollDistance as signal inputs with default values
    _scrollDistance = signal(this.tabOptions.defaultScrollDistance);

    // Default scroll speed, can be adjusted as needed
    _scrollSpeed = signal(this.tabOptions.defaultScrollSpeed);

    @Input() set scrollDistance(value: number) {
        this._scrollDistance.set(value);
    }

    @Input() set scrollSpeed(value: string) {
        this._scrollSpeed.set(value);
    }

    /**
     * The active tab.
     * This is the tab that is currently selected.
     * We use a signal to make sure that the active tab is updated when the tab is selected.
     *
     * @internal
     */
    _activeTab = signal('');

    /**
     * The name of the active tab.
     * If not provided, the first tab will be selected.
     *
     * This will be the name of the tab that is selected.
     */
    @Input() set activeTab(value: string | number) {
        // TODO: convert to signal inputs when available on Storybook
        this._activeTab.set(value.toString());
        this.selectTab(value.toString());
    }

    /**
     * Event emitted when the active tab is changed.
     * The event payload is the name of the active tab.
     */
    @Output() activeTabChanged = new EventEmitter<string>();

    /**
     * Event emitted when a tab is clicked.
     * The event payload is an object with the name of the tab and the event that triggered the click.
     */
    @Output() tabChanged = new EventEmitter<{ name: string; event: MouseEvent }>();

    /** The size of the tabs. (small or large) */
    @Input() size: TabsGroupSizesType = 'large';

    /** The variant of the tabs. (vertical or horizontal) */
    @Input() variant: TabsGroupVariantsType = 'vertical';

    /** The indicator of the tabs. (underline or fill) */
    @Input() indicator: TabsGroupIndicatorType = 'underline';

    /**
     * Use inverse style for tabs when set to true.
     */
    @Input({ transform: booleanAttribute }) inverse = false;

    /**
     * The aria label for the previous navigation arrow.
     * This is used by screen readers to announce the navigation arrow.
     */
    @Input() ariaLabelNavigationArrowPrev = 'prev';

    /**
     * The aria label for the next navigation arrow.
     * This is used by screen readers to announce the navigation arrow.
     */
    @Input() ariaLabelNavigationArrowNext = 'next';

    /**
     * The id of the tabs group.
     * This is used to generate unique ids for the tabs.
     *
     * @internal
     */
    _id = getTabId();

    /**
     * Whether the tabs should be scrollable.
     * This is used to enable or disable the navigation arrows.
     * @internal
     */
    _scrollable = signal(true);

    /*
     * We want to have navigation arrows enabled by default, and disable them only when needed.
     */
    @Input({ transform: booleanAttribute }) set scrollable(value: boolean) {
        // TODO: convert to signal inputs when available on Storybook
        this._scrollable.set(value);
    }

    /*
     * Whether the tabs should take up the full width of the container.
     *
     * The default value is based on the tab options which can be configured using the `provideTabOptions` function.
     */
    @Input({ transform: booleanAttribute }) fullWidthTabs: boolean = this.tabOptions.fullWidthTabs;

    /**
     * The tabs.
     * This is a list of tabs that are used to render the tabs.
     * Each tab is a `DsTab` component.
     * Example:
     * ```html
     * <ds-tabs-group>
     *   <ds-tab [name]="'tab1'" [title]="'Tab 1'">Tab 1</ds-tab>
     *   <ds-tab [name]="'tab2'" [title]="'Tab 2'">Tab 2</ds-tab>
     * </ds-tabs-group>
     * ```
     */
    @ContentChildren(DsTab) tabs: QueryList<DsTab> | undefined;

    protected _tabs = signal<DsTab[]>([]);

    /**
     * `TemplateRef` for the left arrow.
     *
     * @example
     * ```html
     * <ds-tabs-group>
     *   ...
     *   <ng-template #dsTabsLeftArrow> <- </ng-template>
     * </ds-tabs-group>
     * ```
     */
    @ContentChild('dsTabsLeftArrow') dsTabsLeftArrowTpl?: TemplateRef<any>;

    /**
     * `TemplateRef` for the right arrow.
     *
     * @example
     * ```html
     * <ds-tabs-group>
     *   ...
     *   <ng-template #dsTabsRightArrow> -> </ng-template>
     * </ds-tabs-group>
     * ```
     */
    @ContentChild('dsTabsRightArrow') dsTabsRightArrowTpl?: TemplateRef<any>;

    /**
     * The tab header items container.
     * This is the container that holds the tab header list.
     *
     * @internal
     */
    @ViewChild('tabHeaderItemsContainer', { static: true })
    _tabHeaderItemsContainer!: ElementRef<HTMLElement>;

    /**
     * The tab header items list.
     * This is the list that holds the tab header items.
     *
     * @internal
     */
    @ViewChild('tabHeaderItemsList', { static: true })
    _tabHeaderItemsList!: ElementRef<HTMLUListElement>;

    @ViewChildren('tabItem') tabItems?: QueryList<ElementRef>;

    ngAfterViewInit(): void {
        if (this.tabItems) {
            this.tabItems.forEach((option, index) => {
                this._focusMonitor.monitor(option.nativeElement, true).subscribe((focusOrigin) => {
                    if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                        this._tabs()[index].setFocused(true);
                    } else if (!focusOrigin) {
                        this._tabs()[index].setFocused(false);
                    }
                });
            });
        }
    }

    override ngAfterContentInit() {
        if (this.tabs) {
            this.tabs.changes.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
                const tabs = this.tabs?.toArray() ?? [];
                this._tabs.set(tabs);

                // if there are no tabs, do nothing
                if (tabs.length === 0) {
                    return;
                }

                // check if the selected tab still exists
                const selectedTab = this.selectedTab();
                if (!selectedTab) {
                    // try to select the previously selected tab name if it exists
                    if (this._activeTab()) {
                        this.selectTab(this._activeTab());
                    } else {
                        // select the first tab if the selected tab does not exist
                        this.selectTab(tabs[0].name());
                    }
                }
            });

            this._tabs.set(this.tabs.toArray() ?? []);

            this.selectTab(this._activeTab() || this.tabs.first.name());

            super.ngAfterContentInit();
        }
    }

    /**
     * Selects a tab by name.
     * This will set the `selected` property of the tab to `true` and emit the `activeTabChanged` event.
     *
     * @param name - The name of the tab to select.
     * @param event - The event that triggered the selection.
     */
    selectTab(name: string, event?: MouseEvent) {
        this._activeTab.set(name);

        this.tabs?.forEach((tab) => {
            tab.selected.set(tab.name() === name);
        });

        this.activeTabChanged.emit(name);

        if (event) {
            this.tabChanged.emit({ name, event });
        }
    }

    /**
     * Returns the selected tab.
     * This will return the first tab that is selected.
     *
     * @returns The selected tab.
     * @internal
     */
    private selectedTab(): DsTab | undefined {
        return this.tabs?.find((tab) => tab.selected());
    }

    /**
     * Returns the host class based on the size and indicator.
     *
     * @returns The host class.
     * @internal
     */
    get hostClass() {
        const sizeClass = this.size === 'small' ? 'ds-tabs-small' : 'ds-tabs-large';
        const indicatorClass = this.indicator === 'underline' ? 'ds-tab-underline' : 'ds-tab-fill';

        return `ds-tabs-group ${sizeClass} ${indicatorClass}`;
    }

    get tabHeaderItemsClass() {
        return `ds-tab-header-items ds-tab-items-scroll-speed-${this._scrollSpeed()}`;
    }

    focusOption(tab: DsTab, index: number) {
        const focusOption = this.tabItems?.get(index);
        if (focusOption) {
            this._tabs().forEach((tabOptionObj) => {
                tabOptionObj.setFocused(false);
            });
            tab.setFocused(true);
            this._focusMonitor.focusVia(focusOption.nativeElement, 'keyboard');
        }
    }

    onKeydown(event: KeyboardEvent) {
        const { key } = event;
        const tabsList = this._tabs();
        const currentIndex = tabsList.findIndex((tab) => tab.focused());
        let newIndex: number | undefined;
        const nextFocusTabIndex = this.getNextFocusTabIndex(key, currentIndex);
        if (key === 'ArrowRight') {
            newIndex = (currentIndex + nextFocusTabIndex) % tabsList.length;
        } else if (key === 'ArrowLeft') {
            newIndex = (currentIndex - nextFocusTabIndex + tabsList.length) % tabsList.length;
        } else if ((key === ' ' || key === 'Enter') && currentIndex !== -1) {
            this.selectTab(tabsList[currentIndex].name());
        }

        if (newIndex !== undefined) {
            event.preventDefault();
            const newTab = tabsList[newIndex];
            if (newTab) {
                this.focusOption(newTab, newIndex);
            }
        }
    }

    getNextFocusTabIndex(key: string, currentIndex: number): number {
        if (key === 'ArrowRight' && this._tabs()[currentIndex + 1]) {
            return this._tabs()[currentIndex + 1].disabled() ? 2 : 1;
        } else if (key === 'ArrowLeft' && this._tabs()[currentIndex - 1]) {
            return this._tabs()[currentIndex - 1].disabled() ? 2 : 1;
        }
        return 1;
    }

    ngOnDestroy() {
        if (this.tabItems) {
            this.tabItems.forEach((option) => this._focusMonitor.stopMonitoring(option));
        }
    }
}
