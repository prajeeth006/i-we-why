import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

@ClientConfig({ key: 'vnTrackerId', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: trackerIdConfigFactory,
})
export class TrackerIdConfig {
    queryStrings: string[];
}

export function trackerIdConfigFactory(service: ClientConfigService) {
    return service.get(TrackerIdConfig);
}
