import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

@ClientConfig({ key: 'vnRtms', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: rtmsConfigFactory,
})
export class RtmsConfig {
    isEnabled: boolean;
    host: string;
    keepAliveMilliseconds: number;
    reconnectMilliseconds: number;
    tracingEnabled: boolean;
    tracingBlacklistPattern: string;
    disabledEvents: { [event: string]: string };
    remoteLogLevels: string[];
    backgroundEvents: string[];
    establishConnectionOnlyInLoginState: boolean;
    connectionDelayInMilliseconds: number;
}

export function rtmsConfigFactory(service: ClientConfigService) {
    return service.get(RtmsConfig);
}
