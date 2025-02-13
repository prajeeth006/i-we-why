import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { AvrImageService } from 'src/app/common/services/data-feed/avr-service/avr-image.service';
import { AvrDataFeedService } from 'src/app/common/services/data-feed/avr-service/avr-data-feed.service';
import { AvrTemplate } from '../models/avr-template.model';

@Injectable({
    providedIn: 'root'
})
export class AvrVideoService {
    avrVideoPage: AvrTemplate = new AvrTemplate();

    avrBackgroundImage$ = this.avrImageService.backgroundImage$;
    avrBrandImage$ = this.avrImageService.brandImage$;

    data$ = combineLatest([
        this.avrBrandImage$,
        this.avrBackgroundImage$
    ]).pipe(
        map(([imageContent, backgroundImage]) => {
            this.avrVideoPage.brandImageUrl = imageContent?.brandImage?.src;
            this.avrVideoPage.backgroundImageUrl = backgroundImage?.brandImage?.src;
            return this.avrVideoPage;
        }),
        tap((avrResultTemplate: AvrTemplate) => {}),
        catchError(err => {
            return EMPTY;
        })
    );

    constructor(private avrService: AvrDataFeedService,
        private avrImageService: AvrImageService
    ) {
    }

    setControllerId(controllerId: string) {
        this.avrService.setControllerId(new QueryParamEvent(controllerId));
    }

    setEventName(eventName: string) {
        if (!!eventName) {
            this.avrVideoPage.eventName = eventName;
        }
    }

    setEventDate(eventDateTime: string) {
        if (!!eventDateTime) {
            this.avrVideoPage.eventName = this.convertFromStringToDate(eventDateTime) + " " + this.avrVideoPage.eventName;
        }
    }

    private convertFromStringToDate(responseDate: string): string {
        let dateComponents = responseDate.split('T');
        let timePieces = dateComponents[1].split(":");
        return timePieces.length > 2 ? (timePieces[0] + ":" + timePieces[1]) : ''
    }
}
