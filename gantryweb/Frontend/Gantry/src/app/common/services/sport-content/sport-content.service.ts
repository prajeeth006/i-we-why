import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, shareReplay } from 'rxjs';
import { SportContentParameters } from '../../models/sport-content/sport-content-parameters.model';
import { HttpService } from '../http.service';
import { HttpParams } from '@angular/common/http';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class SportContentService {

  sportContentFromSitecore$: Observable<SportContentParameters>;

  constructor(
    private httpService: HttpService,
    private errorService: ErrorService
  ) { }

  public getContent(itemPath: string) {
    return this.httpService.get<SportContentParameters>('en/api/getSportContentByItemPath',
      new HttpParams().set("itemPath", itemPath)
    ).pipe(
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      }),
      shareReplay()
    );
  }

}
