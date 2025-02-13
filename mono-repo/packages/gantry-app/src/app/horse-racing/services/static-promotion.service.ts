import { Injectable } from '@angular/core';

import { EMPTY, catchError, tap } from 'rxjs';

import { ErrorService } from '../../common/services/error.service';
import { HttpService } from '../../common/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class StaticPromotionService {
    constructor(
        private httpService: HttpService,
        private errorService: ErrorService,
    ) {}

    errorMessage$ = this.errorService.errorMessage$;
    getHorseRacingContent(itemIdOrPath: any) {
        return this.httpService.get('en/api/getStaticPromotionContent', itemIdOrPath).pipe(
            tap((data: any) => {
                if (!(data && (data?.backgroundImage?.src || data?.foregroundImage?.src))) {
                    this.errorService.setError('Error in showing static promotion');
                    this.errorService.logError(
                        `Didn't got data from sitecore as itemId returned is ${itemIdOrPath?.itemIdOrPath}, Please check itemId passed in URL present in sitecore or not, it should be published to Web DB as well. Inform d.dtp.cms if you think everything is fine from content perspective.`,
                    );
                }
                return data;
            }),
            catchError(() => {
                this.errorService.logError(
                    `Didn't got data from sitecore as itemId returned is ${itemIdOrPath?.itemIdOrPath}, Please check itemId passed in URL present in sitecore or not, it should be published to Web DB as well. Inform d.dtp.cms if you think everything is fine from content perspective.`,
                );
                return EMPTY;
            }),
        );
    }
}
