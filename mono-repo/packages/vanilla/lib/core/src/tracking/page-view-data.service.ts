import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Subject } from 'rxjs';

import { TrackingData } from './tracking-core.models';

/**
 * @whatItDoes Can be used to specify page view data for a route.
 *
 * @howToUse
 *
 * ```
 * @Component({
 *     selector: 'cmp',
 *     template: 'cmp.html',
 * })
 * export class CmpComponent implements OnInit {
 *     constructor(private activatedRoute: ActivatedRoute, private pageViewDataService: PageViewDataService) { }
 *
 *     ngOnInit() {
 *         // can be also called after some async operation
 *         this.pageViewDataService.setDataForNavigation(this.activatedRoute.snapshot, {
 *             'page.name': 'custom name'
 *         });
 *     }
 * }
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class PageViewDataService {
    private listeners: Map<ActivatedRouteSnapshot, Subject<TrackingData>> = new Map();

    /** @internal */
    installListener(route: ActivatedRouteSnapshot, subject: Subject<TrackingData>) {
        this.listeners.set(route, subject);
    }

    /** @internal */
    uninstallListener(route: ActivatedRouteSnapshot) {
        this.listeners.delete(route);
    }

    setDataForNavigation(route: ActivatedRouteSnapshot, data: TrackingData) {
        const listener = this.listeners.get(route);
        if (listener) {
            listener.next(data);
        }
    }
}
