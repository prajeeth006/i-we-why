import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { CricketCountriesContent } from '../models/cricket-countries.model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class CricketContentService {

  data$ = this.sportContentService.getContent(ContentItemPaths.cricket);

  countriesData$ = this.httpService.get< Array<CricketCountriesContent>>('en/api/getCricketCountries')
    .pipe(shareReplay());

  constructor(
    private httpService: HttpService,
    private sportContentService: SportContentService
  ) { }

}
