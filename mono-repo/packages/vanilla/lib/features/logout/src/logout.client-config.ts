import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

export enum LogoutMessageType {
    DISABLED = '',
    LOGOUT_MESSAGE = 'logoutmessage',
    LOGOUT_MESSAGE_WITH_STATS = 'logoutmessagewithstats',
    LOGOUT_MESSAGE_LIMITS = 'logoutmessagelimits',
    LOGOUT_MESSAGE_SESSION_SUMMARY = 'logoutmessagesessionsummary',
}

@LazyClientConfig({ key: 'vnLogout', product: ClientConfigProductName.SF })
@Injectable()
export class LogoutConfig extends LazyClientConfigBase {
    logoutMessage: LogoutMessageType;
}

export function logoutConfigFactory(service: LazyClientConfigService) {
    return service.get(LogoutConfig);
}
