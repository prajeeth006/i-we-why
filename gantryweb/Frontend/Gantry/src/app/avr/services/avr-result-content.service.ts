import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { AvrContent } from '../models/avr-result-content.model';

@Injectable({
    providedIn: 'root'
})
export class AvrContentService {

    data$ = this.httpService.get<AvrContent>('en/api/getAvrContent')
        .pipe(shareReplay());

    constructor(
        private httpService: HttpService
    ) { }

}
