import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { HttpService } from '../../common/services/http.service';
import { HorseRacingContent } from '../models/horseracing-content.model';

@Injectable({
    providedIn: 'root',
})
export class HorseRacingContentService {
    data$ = this.httpService.get<HorseRacingContent>('en/api/getHorseRacingContent').pipe(shareReplay());

    constructor(private httpService: HttpService) {}
}
