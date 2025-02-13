import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, concatMap, shareReplay } from 'rxjs';

import { HttpService } from '../../common/services/http.service';
import { CheckEvrAvrByTypeId } from '../models/evr-avr-configuration.model';

@Injectable({
    providedIn: 'root',
})
export class EvrAvrConfigurationService {
    private subject = new BehaviorSubject<string | null>(null);
    typeId$ = this.subject.asObservable();

    private evrAvrRaceBehaviorSubject = new BehaviorSubject<CheckEvrAvrByTypeId>({ isAvrRace: false, isEvrRace: false });

    delay: number = 0;
    evrAvrRace$ = this.evrAvrRaceBehaviorSubject.asObservable();
    evrRaceCheckInitialized: boolean = false;
    isEvrAvrRace$ = this.typeId$.pipe(
        concatMap((typeId: string) => {
            return this.httpService.get<CheckEvrAvrByTypeId>('en/api/checkEvrAvrByTypeId', new HttpParams().set('typeId', typeId));
        }),
        shareReplay(),
    );

    evrOffPageDelay$ = this.httpService.get<number>('en/api/getEvrOffPageDelay').pipe(shareReplay());

    constructor(private httpService: HttpService) {}

    setTypeId(typeId: string) {
        this.subject.next(typeId);
    }

    setDelay(delay: number) {
        this.delay = delay;
    }

    setEvrAvrRaceCheck(isEvrAvrRace: CheckEvrAvrByTypeId) {
        this.evrAvrRaceBehaviorSubject.next(isEvrAvrRace);
    }

    isEvrRace() {
        return this.evrAvrRaceBehaviorSubject.value.isEvrRace;
    }

    isAvrRace() {
        return this.evrAvrRaceBehaviorSubject.value.isAvrRace;
    }
}
