import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private targetRuleItemSubject = new BehaviorSubject<string>(null);
  constructor(private httpService:HttpService) { }

  setTargetRuleitem(targetrulesItemId: string) {
    this.targetRuleItemSubject.next(targetrulesItemId);
  }

  data$ = this.targetRuleItemSubject
  .pipe(
    concatMap(( targetRuleItem ) => {
      return this.httpService.get('en/api/getCarouselUrls', new HttpParams()
            .set('targetrulesItemId', targetRuleItem));
    }),
    shareReplay()
    );

}
