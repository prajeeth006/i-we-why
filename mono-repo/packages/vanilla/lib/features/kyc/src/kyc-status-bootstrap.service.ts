import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { KycStatusService } from '@frontend/vanilla/shared/kyc';

@Injectable()
export class KycStatusBootstrapService implements OnFeatureInit {
    constructor(private kycStatusService: KycStatusService) {}

    async onFeatureInit() {
        this.kycStatusService.refresh({ cached: true });
    }
}
