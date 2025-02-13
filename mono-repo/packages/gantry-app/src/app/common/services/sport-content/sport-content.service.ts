import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, shareReplay, startWith } from 'rxjs';

import { SportContentParameters } from '../../models/sport-content/sport-content-parameters.model';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root',
})
export class SportContentService {
    sportContentFromSitecore$: Observable<SportContentParameters>;

    constructor(private httpService: HttpService) {}

    public getContent(itemPath: string) {
        return this.httpService.get<SportContentParameters>('en/api/getSportContentByItemPath', new HttpParams().set('itemPath', itemPath)).pipe(
            startWith({} as SportContentParameters), // Initial Value
            shareReplay(),
        );
    }
}
