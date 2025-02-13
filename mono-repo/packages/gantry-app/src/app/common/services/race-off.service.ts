import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RaceOffService {
    isRaceOffSubject = new BehaviorSubject<boolean>(false);
    isRaceOff$ = this.isRaceOffSubject.asObservable();

    constructor() {}
}
