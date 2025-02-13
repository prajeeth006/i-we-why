import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { BrandImageContent } from 'src/app/common/components/error/models/error-content.model';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EpsImageService {

brandImage$ = this.httpService.get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/BrandImage')
  .pipe(shareReplay());

promoImage$ = this.httpService.get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/EpsImage')
.pipe(shareReplay());

  constructor(private httpService: HttpService) { }
}
