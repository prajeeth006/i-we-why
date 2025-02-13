import { Injectable, inject } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class ProductSwitchCoolOffResourceService {
    private apiService = inject(SharedFeaturesApiService);

    setPlayerArea(newArea: string, oldArea: string) {
        return this.apiService.post('productswitchcooloff/setplayerarea', { newArea: newArea, oldArea: oldArea });
    }
}
