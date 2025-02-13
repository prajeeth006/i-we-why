import { Injectable } from '@angular/core';

import { getClientConfigProperties } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClaimsConfig } from './claims.client-config';

/**
 * @whatItDoes Provides user claims from the underlying config
 *
 * @howToUse
 *
 * ```
 * user.claims.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name')
 * user.claims.get('name') // short names also work
 * ```
 *
 * @description
 *
 * Accesses user claims on the client.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ClaimsService {
    private shortClaimName: { [shortName: string]: string };

    constructor(
        private claimsConfig: ClaimsConfig,
        private clientConfigService: ClientConfigService,
    ) {
        this.generateShortNames();

        this.clientConfigService.updates.subscribe((diff) => {
            if (diff.has(getClientConfigProperties(ClaimsConfig).key)) {
                this.generateShortNames();
            }
        });
    }

    get(claimType: string): string | null {
        let value = this.claimsConfig[claimType];

        if (value === undefined && claimType) {
            value = this.claimsConfig[this.shortClaimName[claimType.toLowerCase()]!];
        }

        if (value === undefined) {
            return null;
        }

        return value;
    }

    private generateShortNames() {
        this.shortClaimName = this.shortClaimName || {};

        Object.keys(this.claimsConfig).forEach((type: string) => {
            const shortName = type.substring(type.lastIndexOf('/') + 1).toLowerCase();

            if (this.shortClaimName[shortName] === undefined) {
                this.shortClaimName[shortName] = type;
            }
        });
    }
}
