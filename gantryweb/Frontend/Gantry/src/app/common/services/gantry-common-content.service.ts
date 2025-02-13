import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { GantryCommonContent } from '../models/gantry-commom-content.model';

@Injectable({
  providedIn: 'root'
})
export class GantryCommonContentService {

  data$ = this.httpService.get<GantryCommonContent>('en/api/getGantryCommonContent')
            .pipe(shareReplay());


  constructor(
    private httpService:HttpService
  ) { }

}
