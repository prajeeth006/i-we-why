import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { tap } from 'rxjs';

import { RouteDataService } from '../../../common/services/route-data.service';
import { MultiViewUrl } from '../../models/MultiViewUrl';
import { MultiviewService } from '../../services/multiview.service';

@Component({
    selector: 'gn-multiview',
    templateUrl: './multiview.component.html',
    styleUrls: ['./multiview.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MultiviewComponent {
    multiViewUrls: Map<number, MultiViewUrl> = new Map<number, MultiViewUrl>();
    defaultUrl: string = '/';

    constructor(
        private sanitizer: DomSanitizer,
        private routeDataService: RouteDataService,
        private multiviewService: MultiviewService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const targetrulesItemId = queryParams['targetrulesItemId'];
        this.multiviewService.setTargetRuleitem(targetrulesItemId);
    }

    vm$ = this.multiviewService.data$.pipe(
        tap((multiViewUrls: MultiViewUrl[]) => {
            this.prepareSafeUrl(multiViewUrls);
        }),
    );

    private prepareSafeUrl(multiViewUrls: MultiViewUrl[]) {
        Array.from({ length: 4 }).map((_, index) => {
            let multiViewUrl = multiViewUrls.find((x) => x.displayOrder == index + 1);
            if (multiViewUrl) {
                if (multiViewUrl.carousel) {
                    multiViewUrl.carousel.forEach((carouselUrl) => {
                        carouselUrl.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(carouselUrl?.url ? carouselUrl?.url : this.defaultUrl);
                    });
                } else {
                    multiViewUrl.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(multiViewUrl?.url ? multiViewUrl?.url : this.defaultUrl);
                }
                this.multiViewUrls.set(index + 1, multiViewUrl);
            } else {
                multiViewUrl = {};
                multiViewUrl.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl);
                this.multiViewUrls.set(index + 1, multiViewUrl);
            }
        });
    }
}
