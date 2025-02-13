import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

import { getClientConfigProperties } from '../../client-config/client-config.decorator';
import { ClientConfigDiff } from '../../client-config/client-config.model';
import { ClientConfigService } from '../../client-config/client-config.service';
import { ClaimsConfig } from '../../user/claims.client-config';
import { ClaimsService } from '../../user/claims.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class ClaimDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private claimsService: ClaimsService,
        clientConfigService: ClientConfigService,
    ) {
        clientConfigService.updates.pipe(filter((e: ClientConfigDiff) => e.has(getClientConfigProperties(ClaimsConfig).key))).subscribe((e) => {
            const claims = e.get(getClientConfigProperties(ClaimsConfig).key)!;

            const refs: string[] = [];

            claims.forEach((_, claim: string) => {
                refs.push(claim.toLocaleLowerCase());
                refs.push(claim.substring(claim.lastIndexOf('/') + 1).toLowerCase());
            });

            dslCacheService.invalidate(refs.map((r: string) => `claim.Get.${r}`));
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Claims: this.dslRecorderService.createRecordable('claim').createFunction({
                name: 'Get',
                get: (name: string) => this.claimsService.get(name) || '',
                deps: [{ key: 'claim.Get', args: 1, argsToLowerCase: true }],
            }),
        };
    }
}
