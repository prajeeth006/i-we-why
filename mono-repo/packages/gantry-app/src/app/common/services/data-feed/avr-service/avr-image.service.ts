import { Injectable } from '@angular/core';

import { BehaviorSubject, concatMap, shareReplay } from 'rxjs';

import { AvrEventNamesEnum, AvrEventTypeEnum } from '../../../../avr/models/avr-result-enum.model';
import { AvrCommonService } from '../../../../avr/services/common/avr-common.service';
import { BrandImageContent } from '../../../components/error/models/error-content.model';
import { HttpService } from '../../http.service';

@Injectable({
    providedIn: 'root',
})
export class AvrImageService {
    private eventTypeSubject = new BehaviorSubject<string | null>(null);
    private backgroundImageSubject = new BehaviorSubject<string | null>(null);

    backgroundImage$ = this.backgroundImageSubject.pipe(
        concatMap((backgroundImagePath) => {
            return this.httpService.get<BrandImageContent>(
                'en/api/getBrandImage?path=/Gantry/GantryWeb/AvrContent/AvrBackgroundImage_' + backgroundImagePath,
            );
        }),
        shareReplay(),
    );

    brandImage$ = this.avrCommonService.controllerId$.pipe(
        concatMap(() => {
            const brandImagePath = '/Gantry/GantryWeb/AvrContent/NewDesignBrandImage/';
            return this.httpService.get<BrandImageContent>(`en/api/getBrandImage?path=${brandImagePath + this.avrCommonService.getControllerId()}`);
        }),
        shareReplay(),
    );

    brandTVImage$ = this.avrCommonService.controllerId$.pipe(
        concatMap(() => {
            const brandImagePath = '/Gantry/GantryWeb/AvrContent/NewDesignAvrVideoBrandImages/';
            return this.httpService.get<BrandImageContent>(`en/api/getBrandImage?path=${brandImagePath + this.avrCommonService.getControllerId()}`);
        }),
        shareReplay(),
    );

    constructor(
        private httpService: HttpService,
        public avrCommonService: AvrCommonService,
    ) {}

    setEventType(eventType: string) {
        this.eventTypeSubject.next(eventType);
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                switch (this.avrCommonService.getCourseIsJump()) {
                    case AvrEventTypeEnum.CourseIsNotJump:
                        this.backgroundImageSubject.next(AvrEventNamesEnum.Horse);
                        break;
                    case AvrEventTypeEnum.CourseIsJump:
                        this.backgroundImageSubject.next(AvrEventNamesEnum.JumpHorse);
                        break;
                    default:
                        this.backgroundImageSubject.next(AvrEventNamesEnum.Horse);
                }
                break;
            case AvrEventTypeEnum.DogRace:
                this.backgroundImageSubject.next(AvrEventNamesEnum.Dog);
                break;
            case AvrEventTypeEnum.MotorRace:
                this.backgroundImageSubject.next(AvrEventNamesEnum.Motor);
                break;
        }
    }
}
