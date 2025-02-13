import { ViewTemplate } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { OfferButtonConfig } from '../../../features/offer-button/src/offer-button.client-config';

@Mock({ of: OfferButtonConfig })
export class OfferButtonConfigMock extends OfferButtonConfig {
    override whenReady: Subject<void> = new Subject();
    override content: ViewTemplate = {
        messages: {
            'error': 'Error',
            'expired': 'Expired',
            'invalid': 'Invalid',
            'not-offered': 'Not Offered',
            'offered': 'Offered',
            'opted-in': 'Opted In',
            'opted-out': 'Opted Out',
            'unknown': 'Unknown',
        },
    };
    override buttonClass: ViewTemplate = {
        messages: {
            'error': 'danger theme-error-i',
            'expired': 'info theme-info-i',
            'invalid': 'danger theme-error-i',
            'not-offered': 'info theme-info-i',
            'opted-in': 'success theme-success-i',
            'opted-out': 'info theme-info-i',
        },
    };
    override iconClass?: ViewTemplate = {
        messages: {
            'error': 'danger theme-error-i',
            'expired': 'info theme-info-i',
            'invalid': 'danger theme-error-i',
            'not-offered': 'info theme-info-i',
            'opted-in': 'success theme-success-i',
            'opted-out': 'info theme-info-i',
            'offered': 'info theme-info-i offered',
        },
    };
}
