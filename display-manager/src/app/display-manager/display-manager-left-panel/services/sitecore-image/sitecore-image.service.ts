import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/common/api.service';

export class SitecoreImages {
  [attr: string]: string;
}

export class SitecoreMedia {
  name: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class SitecoreImageService {
  mediaAssets$: BehaviorSubject<SitecoreImages | null> = new BehaviorSubject<SitecoreImages | null>(null);

  constructor(private apiService: ApiService) {
    this.getSiteCoreMediaAssets();
  }

  getSiteCoreMediaAssets() {
    this.apiService.get<SitecoreMedia[]>('/sitecore/api/displayManager/getSiteCoreMediaAssets')
      .pipe(
        map((assets) => {
          const siteCoreMediaAssets: SitecoreImages = {};
          assets?.forEach((mediaAsset: SitecoreMedia) => {
            siteCoreMediaAssets[mediaAsset?.name] = mediaAsset?.path;
          });
          return siteCoreMediaAssets;
        }),
        shareReplay()
      )
      .subscribe((siteCoreMediaAssets: SitecoreImages) => {
        this.mediaAssets$.next(siteCoreMediaAssets);
      });
  }
}
