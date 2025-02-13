import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { RouteDataService } from '../../common/services/route-data.service';

@Component({
    selector: 'gn-nrm',
    templateUrl: './nrm.component.html',
    styleUrls: ['./nrm.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NrmComponent implements OnInit {
    url: SafeResourceUrl;

    constructor(
        private routeDataService: RouteDataService,
        private sanitizer: DomSanitizer,
    ) {}

    ngOnInit(): void {
        const queryParams = this.routeDataService.getQueryParams();
        let url = decodeURIComponent(queryParams['url']);
        const xParam = decodeURIComponent(queryParams['xParam']);

        if (!xParam || !url) {
            throw Error(`Required parameters not passed: xParam: "${xParam}", url: "${url}"`);
        }

        const xParamJson = JSON.parse(xParam);

        url = url.replace('{sid}', xParamJson.sid);
        url = url.replace('{did}', xParamJson.did);
        url = url.replace('{bid}', xParamJson.bid);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
