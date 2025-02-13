import { Injectable } from '@angular/core';

import { DslService, MenuContentItem, toBoolean } from '@frontend/vanilla/core';
import { HeaderBarConfig } from '@frontend/vanilla/features/header-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { NavigationItem } from './models';
import { NavigationLayoutConfig } from './navigation-layout.client-config';

/**
 * @whatItDoes This service is used to control the navigation layout
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NavigationLayoutService {
    showTopMenu: BehaviorSubject<NavigationItem | null> = new BehaviorSubject<NavigationItem | null>(null);
    get initialized(): Observable<boolean> {
        return this.initializedEvents;
    }

    private initializedEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private headerEnabledEvents = new BehaviorSubject<boolean>(true);
    private lookup = new Map<string, NavigationItem>();

    get headerEnabled(): Observable<boolean> {
        return this.headerEnabledEvents;
    }

    get isV1orV4(): boolean {
        return [1, 4].includes(this.config.version);
    }

    constructor(
        private config: NavigationLayoutConfig,
        private dslService: DslService,
        private headerBarConfig: HeaderBarConfig,
    ) {}

    init() {
        if (this.isV1orV4) {
            this.config.navigation.children.forEach((level1: MenuContentItem) => {
                level1.children.forEach((top: MenuContentItem) => {
                    this.addToLookup(top, null, level1.children, top.name, top.children, null);
                    if (top.children) {
                        top.children.forEach((item: MenuContentItem) => {
                            this.addToLookup(item, top, level1.children, top.name, top.children, item.name);
                            if (item.children) {
                                item.children.forEach((subitem: MenuContentItem) => {
                                    this.addToLookup(subitem, top, level1.children, top.name, top.children, item.name);
                                });
                            }
                        });
                    }
                });
            });
        }

        this.initializedEvents.next(true);

        this.headerBarConfig.whenReady.subscribe(() => {
            this.dslService
                .evaluateExpression<boolean>(this.headerBarConfig.isEnabledCondition)
                .pipe(distinctUntilChanged())
                .subscribe((enabled) => {
                    this.headerEnabledEvents.next(enabled);
                });
        });
    }

    /** get navigation item */
    getItem(item: string): NavigationItem | null {
        return this.lookup.get(item.toLowerCase()) || null;
    }

    private addToLookup(
        item: MenuContentItem,
        parent: MenuContentItem | null,
        topMenuItems: MenuContentItem[],
        selectedTopItem: string,
        leftMenuItems: MenuContentItem[],
        selectedLeftItem: string | null,
    ) {
        this.lookup.set(item.name.toLowerCase(), {
            name: item.name,
            pageTitle: item.text,
            headerTitle: null,
            parent: parent,
            leftMenuTitle: parent ? parent.text : null,
            selectedLeftItem: selectedLeftItem,
            selectedTopItem: selectedTopItem,
            leftMenuItems: leftMenuItems,
            topMenuItems: topMenuItems.filter((t) => t.parameters['hideTopMenuItem'] != 'true'),
            hideHeaderCloseButton: !!toBoolean(item.parameters['hide-close']),
        });
    }
}
