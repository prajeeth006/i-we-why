import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BrandImageContent } from '../components/error/models/error-content.model';
import { EMPTY, catchError, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultImageService {
  constructor(private httpService: HttpService) { }

  defaultImage$ = this.httpService.get<BrandImageContent>('en/api/getBrandImage?path=/Gantry/GantryWeb/HorseRacingContent/ManualHorseRacingImage')
    .pipe(
      catchError(err => {
        return EMPTY;
      }),
      shareReplay()
    );
}
