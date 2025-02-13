import { Injectable } from "@angular/core";
import { BehaviorSubject, concatMap, shareReplay } from "rxjs";
import { AvrEventTypeEnum } from "src/app/avr/models/avr-result-enum.model";
import { AvrCommonService } from "src/app/avr/services/common/avr-common.service";
import { BrandImageContent } from "src/app/common/components/error/models/error-content.model";
import { HttpService } from "src/app/common/services/http.service";

@Injectable({
  providedIn: "root",
})
export class AvrImageService {
  private eventTypeSubject = new BehaviorSubject<string>(null);
  private backgroundImageSubject = new BehaviorSubject<string>(null);

  backgroundImage$ = this.backgroundImageSubject.pipe(
    concatMap((backgroundImagePath) => {
      return this.httpService.get<BrandImageContent>(
        "en/api/getBrandImage?path=/Gantry/GantryWeb/AvrContent/AvrBackgroundImage_" +
        backgroundImagePath
      );
    }),
    shareReplay()
  );

  brandImage$ = this.avrCommonService.controllerId$.pipe(
    concatMap(() => {
      return this.httpService.get<BrandImageContent>(
        `en/api/getBrandImage?path=/Gantry/GantryWeb/AvrContent/BrandImage/${this.avrCommonService.getControllerId()}`
      );
    }),
    shareReplay()
  );

  constructor(
    private httpService: HttpService,
    public avrCommonService: AvrCommonService
  ) { }

  setEventType(eventType: string) {
    this.eventTypeSubject.next(eventType);
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        this.backgroundImageSubject.next("Horse");
        break;
      case AvrEventTypeEnum.DogRace:
        this.backgroundImageSubject.next("Dog");
        break;
      case AvrEventTypeEnum.MotorRace:
        this.backgroundImageSubject.next("Motor");
        break;
    }
  }
}
