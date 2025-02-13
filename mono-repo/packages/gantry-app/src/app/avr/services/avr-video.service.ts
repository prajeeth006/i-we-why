import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith } from 'rxjs';

import { BrandImageContent } from '../../common/components/error/models/error-content.model';
import { QueryParamEvent } from '../../common/models/query-param.model';
import { AvrDataFeedService } from '../../common/services/data-feed/avr-service/avr-data-feed.service';
import { AvrImageService } from '../../common/services/data-feed/avr-service/avr-image.service';
import { ErrorService } from '../../common/services/error.service';
import { AvrTemplate } from '../models/avr-template.model';

@Injectable({
    providedIn: 'root',
})
export class AvrVideoService {
    avrVideoPage: AvrTemplate = new AvrTemplate();

    avrBackgroundImage$ = this.avrImageService.backgroundImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );
    avrBrandImage$ = this.avrImageService.brandImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );
    avrTVBrandImage$ = this.avrImageService.brandTVImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );

    data$ = combineLatest([this.avrBrandImage$, this.avrBackgroundImage$, this.avrTVBrandImage$]).pipe(
        map(([imageContent, backgroundImage, tvBrandImage]) => {
            this.avrVideoPage.brandImageUrl = imageContent?.brandImage?.src;
            this.avrVideoPage.backgroundImageUrl = backgroundImage?.brandImage?.src;
            this.avrVideoPage.tvBrandImageUrl = tvBrandImage?.brandImage?.src;

            return this.avrVideoPage;
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    constructor(
        private avrDataFeedService: AvrDataFeedService,
        private avrImageService: AvrImageService,
        private errorService: ErrorService,
    ) {}

    setControllerId(controllerId: string) {
        this.avrDataFeedService.setControllerId(new QueryParamEvent(controllerId));
    }

    setEventName(eventName: string) {
        if (eventName) {
            this.avrVideoPage.eventName = eventName;
        }
    }

    setEventDate(eventDateTime: string) {
        if (eventDateTime) {
            this.avrVideoPage.eventName = this.convertFromStringToDate(eventDateTime) + ' ' + this.avrVideoPage.eventName;
        }
    }

    private convertFromStringToDate(responseDate: string): string {
        const dateComponents = responseDate.split('T');
        const timePieces = dateComponents?.[1]?.split(':');
        return timePieces?.length > 2 ? timePieces[0] + ':' + timePieces[1] : '';
    }

    setOverlay(isOverlay: boolean) {
        this.avrVideoPage.isOverlay = isOverlay;
    }
}
