import { Injectable } from '@angular/core';

import { shareReplay, startWith } from 'rxjs';

import { HttpService } from '../../common/services/http.service';
import { AvrContent } from '../models/avr-result-content.model';

@Injectable({
    providedIn: 'root',
})
export class AvrContentService {
    data$ = this.httpService.get<AvrContent>('en/api/getAvrContent').pipe(
        startWith({} as AvrContent), // Initial Value
        shareReplay(),
    );

    constructor(private httpService: HttpService) {}
}
