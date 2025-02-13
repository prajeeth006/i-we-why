import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    OnChanges,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { WindowHelper } from '../../../common/helpers/window-helper/window-helper';
import { ErrorService } from '../../../common/services/error.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { StaticPromotionService } from '../../services/static-promotion.service';

@Component({
    selector: 'gn-static-promotion',
    templateUrl: './static-promotion.component.html',
    styleUrls: ['./static-promotion.component.scss'],
})
export class StaticPromotionComponent
    implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy
{
    data: any;

    errorMessage$ = this.staticPromotionService.errorMessage$;

    constructor(
        private routeDataService: RouteDataService,
        private staticPromotionService: StaticPromotionService,
        private _windowHelper: WindowHelper,
        private errorService: ErrorService,
    ) {
        this.getHorseRacingContent();
    }

    getHorseRacingContent() {
        const queryParams = this.routeDataService.getQueryParams();

        if (queryParams && !!queryParams['itemIdOrPath']) {
            this.staticPromotionService.getHorseRacingContent(queryParams).subscribe((data: any) => {
                this._windowHelper.raiseEventToElectron();
                if (data && (data?.backgroundImage?.src || data?.foregroundImage?.src)) {
                    this.data = data;
                    this.errorService.isStaleDataAvailable = true;
                }
            });
        } else {
            this.errorService.logError(`Couldn't find itemIdOrPath in url, Please check itemId passed in URL present in sitecore or not.`);
        }
    }

    ngOnInit(): void {
        console.log('ngOnInit');
    }

    ngOnChanges() {
        console.log('ngOnChanges');
    }

    ngDoCheck() {
        console.log('ngDoCheck');
    }

    ngAfterContentInit() {
        console.log('ngAfterContentInit');
    }

    ngAfterContentChecked() {
        console.log('ngAfterContentChecked');
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
    }

    ngAfterViewChecked() {
        console.log('ngAfterViewChecked');
    }

    ngOnDestroy() {
        console.log('ngOnDestroy');
    }
}
