import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { EMPTY, catchError, tap } from 'rxjs';

import { ElectronParamsService } from '../../../common/services/electron-params/electron-params.service';
import { ErrorService } from '../../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../../common/services/logger.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { CarouselUrl } from '../../models/CarouselUrl';
import { CarouselService } from '../../services/carousel.service';

@Component({
    selector: 'gn-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements OnDestroy {
    carouselUrls: CarouselUrl[] = [];
    blankUrl: string = 'about:blank';
    targetruleItemId: string;
    timeout: NodeJS.Timeout;

    constructor(
        private sanitizer: DomSanitizer,
        private routeDataService: RouteDataService,
        private carouselService: CarouselService,
        private electronParamsService: ElectronParamsService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const targetrulesItemId = queryParams['targetrulesItemId'];
        this.targetruleItemId = targetrulesItemId;
        this.carouselService.setTargetRuleitem(targetrulesItemId);
    }

    errorMessage$ = this.errorService.errorMessage$;

    vm$ = this.carouselService.data$.pipe(
        tap((carouselUrls: CarouselUrl[]) => {
            if (carouselUrls?.length > 0) {
                this.errorService.isStaleDataAvailable = true;
                this.errorService.unSetError();
                carouselUrls.forEach((carouselUrl) => {
                    let actualCarouselUrl = carouselUrl.url;
                    let updatedUrl = this.electronParamsService.addParamAddedByElectron(actualCarouselUrl);
                    updatedUrl = this.addScreenTypeParam(updatedUrl);
                    carouselUrl.url = updatedUrl;
                    carouselUrl.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blankUrl);
                });
                if (carouselUrls?.length == 1) {
                    carouselUrls[0].safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(carouselUrls[0]?.url ?? this.blankUrl);
                }

                this.carouselUrls = carouselUrls;
            } else {
                this.retryCarouselUrl(this.targetruleItemId);
                this.errorService.setError('No carousel items found. ' + location.href);
                this.logError(location.href, 'carousel url with event source is not found', 'Zero carousel urls found');
            }
        }),
        catchError((err) => {
            this.retryCarouselUrl(this.targetruleItemId);
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    retryCarouselUrl(targetruleItemId: string) {
        this.timeout = setTimeout(() => {
            this.carouselService.setTargetRuleitem(targetruleItemId);
        }, 30000);
    }

    addScreenTypeParam(url: string): string {
        try {
            const updatedUrl = new URL(url);
            const queryparams = this.routeDataService.getQueryParams();
            const screenType = queryparams['screenType'];
            if (screenType) {
                updatedUrl.searchParams.set('screenType', screenType);
            }

            return updatedUrl.toString();
        } catch (e) {
            const errorLog: Log = {
                level: LogType.Error,
                message: 'Could not able to add param screenType: ' + e.message,
                status: 'NA',
                fatal: false,
            };
            this.loggerService.log(errorLog);
            return url;
        }
    }

    logError(url: string, message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: 'Could not load the carouselUrl: ' + url + ' because ' + message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }

    ngOnDestroy() {
        clearTimeout(this.timeout);
    }
}
