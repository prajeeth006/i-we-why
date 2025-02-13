import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable, Subject, Subscriber, of } from 'rxjs';

import { PageViewDataService } from '../tracking/page-view-data.service';
import { PageViewDataProvider, TrackingData } from '../tracking/tracking-core.models';

@Injectable()
export class RoutingPageViewDataProvider implements PageViewDataProvider {
    constructor(
        private pageViewDataService: PageViewDataService,
        private router: Router,
    ) {}

    getData(): Observable<TrackingData> {
        const routeSnapshot = this.getCurrentRoute();

        if (!routeSnapshot.data['waitForPageViewData']) {
            return of({});
        }

        const listener = new Subject<TrackingData>();

        this.pageViewDataService.installListener(routeSnapshot, listener);

        return new Observable((observer: Subscriber<TrackingData>) => {
            const sub = listener.subscribe((data: TrackingData) => observer.next(data));

            observer.add(sub);
            observer.add(() => this.pageViewDataService.uninstallListener(routeSnapshot));
        });
    }

    private getCurrentRoute(): ActivatedRouteSnapshot {
        let node = this.router.routerState.snapshot.root;

        while (node.firstChild) {
            node = node.firstChild;
        }

        return node;
    }
}
