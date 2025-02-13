import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { BrandImageContent } from 'src/app/common/components/error/models/error-content.model';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class BestOddsGuaranteedImageService {

  brandImage$ = this.httpService.get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/BestOddsGuaranteedImage')
    .pipe(shareReplay());

  constructor(
    private httpService: HttpService
  ) { }

}
