import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ShowErrorPageUrlContent } from '../models/error-content.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorContentService {

  showErrorPageUrl$ = this.httpService.get<ShowErrorPageUrlContent>('en/api/getErrorPageConfiguration')
    .pipe(shareReplay());

  constructor(
    private httpService: HttpService
  ) { }

}
