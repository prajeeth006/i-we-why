import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, concatMap, shareReplay } from 'rxjs';

import { HttpService } from '../../common/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class MultiviewService {
    private targetRuleItemSubject = new BehaviorSubject<string | null>(null);
    constructor(private httpService: HttpService) {}

    setTargetRuleitem(targetrulesItemId: string) {
        this.targetRuleItemSubject.next(targetrulesItemId);
    }

    data$ = this.targetRuleItemSubject.pipe(
        concatMap((targetRuleItem) => {
            return this.httpService.get('en/api/getMultiViewUrls', new HttpParams().set('targetrulesItemId', targetRuleItem!));
        }),
        shareReplay(),
    );
}
