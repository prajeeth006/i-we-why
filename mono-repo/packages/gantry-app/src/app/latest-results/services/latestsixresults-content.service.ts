import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { HttpService } from '../../common/services/http.service';
import { LatestSixResultsContent } from '../models/latestsixresults-content.model';

@Injectable({
    providedIn: 'root',
})
export class LatestSixResultsContentService {
    data$ = this.httpService.get<LatestSixResultsContent>('en/api/getLatestSixResultsContent').pipe(shareReplay());

    constructor(private httpService: HttpService) {}
}
