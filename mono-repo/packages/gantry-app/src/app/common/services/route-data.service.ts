import { Injectable } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RouteDataService {
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    getQueryParams() {
        return this.activatedRoute.snapshot.queryParams;
    }

    getDifferentialPath() {
        const urlSegments = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET]?.segments;
        return urlSegments ? urlSegments[urlSegments.length - 1].path?.toUpperCase() : undefined;
    }

    getUrl() {
        return this.router.url;
    }

    isLatestSixResultUrl() {
        return this.router.url.toUpperCase().includes('LATESTSIX');
    }

    isLatestFourResultUrl() {
        return this.router.url.toUpperCase().includes('LATESTFOUR');
    }
}
