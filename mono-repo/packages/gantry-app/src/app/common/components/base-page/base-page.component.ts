import { Component, Input, ViewEncapsulation } from '@angular/core';

import { ScreenType } from '../../models/screen-size.model';
import { RouteDataService } from '../../services/route-data.service';
import { ScreenTypeService } from '../../services/screen-type.service';

@Component({
    selector: 'gn-base-page',
    templateUrl: './base-page.component.html',
    styleUrls: ['./base-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BasePageComponent {
    @Input() pageWrapperClass: string;
    @Input() headerWrapperClass: string;
    @Input() bodyWrapperClass: string;
    @Input() footerWrapperClass: string;
    @Input() screenType: string;
    isHalfscreenType = ScreenType.half;
    constructor(
        private routeDataService: RouteDataService,
        private screenTypeService: ScreenTypeService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        this.screenType = queryParams['screenType'];
        this.screenTypeService.setScreenType(this.screenType);
    }
}
