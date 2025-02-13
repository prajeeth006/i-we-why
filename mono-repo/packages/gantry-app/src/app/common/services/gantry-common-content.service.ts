import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class GantryCommonContentService {
    data$ = this.httpService.get<GantryCommonContent>('en/api/getGantryCommonContent').pipe(shareReplay());

    constructor(private httpService: HttpService) {}
}
