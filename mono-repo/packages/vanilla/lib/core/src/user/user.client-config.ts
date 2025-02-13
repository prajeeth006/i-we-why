import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnUser', product: ClientConfigProductName.SF, reload: true })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: userConfigFactory,
})
export class UserConfig {
    lang: string;
    loyalty: string | null;
    customerId: number;
    segmentId: number;
    lifeCycleStage: string | null;
    eWarningVip: string | null;
    microSegmentId: number;
    churnRate: number;
    futureValue: number;
    potentialVip: number;
    isAuthenticated: boolean;
    workflowType: number;
    returning: boolean;
    loginDuration: number | null;
    tierCode: number | null;
    isFirstLogin?: boolean;
    lastLoginTime?: Date;
    lastLoginTimeFormatted?: string;
    userTimezoneUtcOffset: number;
    xsrfToken: string | null;
    playerPriority: string | null;
    registrationDate: Date;
    daysRegistered: number;
    visitCount: number;
    visitAfterDays: number;
    [key: string]: any; // Making the class indexable to be able to use this[propertyName];
}

export function userConfigFactory(service: ClientConfigService) {
    return service.get(UserConfig);
}
