import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @whatItDoes Provides common interface to get route data
 *
 * @howToUse
 *
 * ```
 * this.routeDataService.get('param');
 * ```
 *
 * @description
 *
 * This service provides a way to access route data from Angular components.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RouteDataService {
    constructor(private router: Router) {}

    getInitData() {
        return this.getData('initData');
    }

    get(param: string) {
        return this.getData(param);
    }

    private getData(param: string) {
        let node = this.router.routerState.snapshot.root;

        while (node != null) {
            if (node.data[param]) {
                return node.data[param];
            } else {
                node = node.children[0]!;
            }
        }

        return null;
    }
}
