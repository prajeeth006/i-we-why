import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfirmPasswordResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    async isPasswordValidationRequired(): Promise<boolean> {
        const result = await firstValueFrom(this.api.get('confirmpassword/ispasswordvalidationrequired'));
        return result.validationRequired;
    }
}
