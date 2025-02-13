import { Injectable } from '@angular/core';

import { shareReplay, startWith } from 'rxjs';

import { BrandImageContent } from '../components/error/models/error-content.model';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class DefaultImageService {
    constructor(private httpService: HttpService) {}

    getDefaultImage(imagePath: string) {
        return this.httpService.get<BrandImageContent>(`en/api/getBrandImage?path=${imagePath}`).pipe(
            startWith({} as BrandImageContent), // Initial Value
            shareReplay(),
        );
    }
}
