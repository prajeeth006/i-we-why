import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { HttpService } from '../../../../common/services/http.service';
import { ShowErrorPageUrlContent } from '../models/error-content.model';

@Injectable({
    providedIn: 'root',
})
export class ErrorContentService {
    showErrorPageUrl$ = this.httpService.get<ShowErrorPageUrlContent>('en/api/getErrorPageConfiguration').pipe(shareReplay());

    constructor(private httpService: HttpService) {}
}
