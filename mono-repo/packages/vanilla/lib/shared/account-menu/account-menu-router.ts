import { Injectable, inject } from '@angular/core';

import { Logger, MenuContentItem, NavigationService, Page, WINDOW } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AccountMenuDataService } from './account-menu-data.service';

/**
 * @whatItDoes Represents a virtual menu route.
 *
 * @stable
 */
export class MenuRoute {
    children: Map<string, MenuRoute> = new Map();
    parent: MenuRoute | null = null;

    constructor(public item: MenuContentItem) {}
}

/**
 * @whatItDoes Handles routing for account menu.
 *
 * @howToUse
 *
 * Inject to a child component of account menu.
 *
 * ```
 * accountMenuRouter.navigateToRoute('menu/whatever');
 * ```
 *
 * @stable
 */
@Injectable()
export class AccountMenuRouter {
    get currentRoute(): Observable<MenuRoute | null> {
        return this.routeEvents;
    }

    get routerInitialized(): Observable<boolean> {
        return this.initRouterEvents;
    }

    private menuRouteTree: Map<string, MenuRoute> = new Map();
    private routeEvents: BehaviorSubject<MenuRoute | null> = new BehaviorSubject<MenuRoute | null>(null);
    private initRouterEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly #window = inject(WINDOW);

    constructor(
        private accountMenuDataService: AccountMenuDataService,
        private navigationService: NavigationService,
        private log: Logger,
        private page: Page,
    ) {
        this.accountMenuDataService.content.subscribe((c) => {
            this.menuRouteTree.clear();
            this.initRouter(c);
            this.initRouterEvents.next(true);

            const currentRoute = this.routeEvents.value;

            if (currentRoute) {
                const route = this.lookupRoute(currentRoute.item.menuRoute);

                if (route) {
                    this.routeEvents.next(route);
                } else {
                    this.routeEvents.next(this.menuRouteTree.get('menu') || null);
                }
            }
        });
    }

    /** Navigates to a virtual menu route. This is used to display sub levels of the menu tree. */
    navigateToRoute(menuRoute: string, navigateBack: boolean = false, parentMenuRoute: string | null = null) {
        if (this.accountMenuDataService.routerMode) {
            if (navigateBack && parentMenuRoute === null) {
                this.#window.history.back();
            } else {
                if (parentMenuRoute !== null) {
                    this.navigationService.goTo(`/${this.page.lang}/${parentMenuRoute}`);
                } else {
                    this.navigationService.goTo(`/menu/${menuRoute}`);
                }
            }
        } else {
            this.setRoute(menuRoute);
        }
    }

    /** @internal */
    setRoute(menuRoute: string) {
        const route = this.lookupRoute(menuRoute);
        if (route) {
            this.routeEvents.next(route);
        } else {
            this.log.warn(`Tried to navigate to non existent route ${menuRoute}`);
        }
    }

    private initRouter(item: MenuContentItem) {
        if (item.menuRoute) {
            const route = new MenuRoute(item);
            const fragments = item.menuRoute.toLowerCase().split('/');
            const parent = this.lookupRoute(fragments.slice(0, -1));

            if (parent) {
                route.parent = parent;
                const lastFragment = fragments[fragments.length - 1];

                if (lastFragment) {
                    parent.children.set(lastFragment, route);
                }
            } else {
                if (fragments.length !== 1) {
                    this.log.warn(`Detected menu root route ${item.menuRoute} with multiple fragments`);
                }

                if (fragments[0]) {
                    this.menuRouteTree.set(fragments[0], route);
                }
            }
        }

        if (item.children) {
            item.children.forEach((i: MenuContentItem) => this.initRouter(i));
        }
    }

    private lookupRoute(fragments: string[] | string): MenuRoute | undefined {
        if (typeof fragments === 'string') {
            fragments = fragments.split('/');
        }

        let lookup = this.menuRouteTree;
        let route: MenuRoute | undefined;

        for (const fragment of fragments) {
            route = lookup.get(fragment);

            if (!route) {
                return;
            }

            lookup = route.children;
        }

        return route;
    }
}
