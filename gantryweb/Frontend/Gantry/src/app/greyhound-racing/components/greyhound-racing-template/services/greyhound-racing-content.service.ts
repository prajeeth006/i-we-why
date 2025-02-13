import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { TypeFlagCode } from 'src/app/greyhound-racing/models/greyhound-racing.enum';

@Injectable({
  providedIn: 'root'
})
export class GreyhoundRacingContentService {

  private countrySubject = new BehaviorSubject<string>(null);
  private squareImgSubject = new BehaviorSubject<boolean>(true);
  isSquareImageType: boolean;
  data$ = this.countrySubject
    .pipe(
      concatMap((country) => {
        if (!country) {
          country = TypeFlagCode.Uk;
        }
        return this.httpService.get('en/api/getGreyHoundRacingContent', new HttpParams().set('country', country).set('isSquareImage', this.isSquareImageType).set('is2XImage', false));
      }),
      shareReplay()
    );

  constructor(private httpService: HttpService) { }

  setCountry(country: string) {
    this.countrySubject.next(country);
  }

  setImageType(isSquareImage: boolean) {
    this.isSquareImageType = isSquareImage;
    this.squareImgSubject.next(isSquareImage);
  }
}
