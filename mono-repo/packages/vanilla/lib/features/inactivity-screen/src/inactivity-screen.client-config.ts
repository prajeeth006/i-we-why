import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    GenericListItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

import { InactivityMode } from './inactivity-screen.models';

@LazyClientConfig({ key: 'vnInactivityScreen', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: configFactory,
    deps: [LazyClientConfigService],
})
export class InactivityScreenConfig extends LazyClientConfigBase {
    mode: InactivityMode;
    idleTimeout: number;
    countdownTimeout: number; // In seconds
    maxOffsetForIdleTimeout: number;
    enableSessionPopup: boolean;
    resources: GenericListItem;
    overlay?: ViewTemplateForClient;
    showLogoutButton: boolean;
    showOkButton: boolean;
    showHeaderCloseButton: boolean;
    prolongSession: boolean;
    webVersion: number;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(InactivityScreenConfig);
}
