import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { DepositLimitsConfig } from './deposit-limits.client-config';

@Injectable()
export class DepositLimitsBootstrapService {
    constructor(private config: DepositLimitsConfig) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
    }
}
