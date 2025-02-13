import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

interface Toastr {
    name: string;
    schedule?: string;
    placeholders?: { [key: string]: PropertyInfo };
}

interface PropertyInfo {
    propertyName: string;
    format?: 'number' | 'currency' | 'date';
    parameters?: Parameters;
}

interface Parameters {
    currencyCode?: string;
    digitsInfo?: string;
    dateFormat?: string;
    timezone?: string;
}

@LazyClientConfig({ key: 'vnRtmsEvents', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class RtmsEventsConfig extends LazyClientConfigBase {
    isCashierRedirectEnabled: boolean;
    rtmsEventToToastr: { [key: string]: Toastr };
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(RtmsEventsConfig);
}
