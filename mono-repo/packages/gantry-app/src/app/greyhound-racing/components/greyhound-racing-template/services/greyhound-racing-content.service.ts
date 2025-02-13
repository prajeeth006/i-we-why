import { Injectable } from '@angular/core';

import { BehaviorSubject, shareReplay } from 'rxjs';

import { HttpService } from '../../../../common/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class GreyhoundRacingContentService {
    private countrySubject = new BehaviorSubject<string | null>(null);

    data$ = this.httpService.get('en/api/getGreyHoundRacingContent').pipe(shareReplay());

    constructor(private httpService: HttpService) {}

    setCountry(country: string) {
        this.countrySubject.next(country);
    }
}
