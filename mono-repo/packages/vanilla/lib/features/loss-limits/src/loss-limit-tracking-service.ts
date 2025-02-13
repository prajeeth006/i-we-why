import { Injectable } from '@angular/core';

import { TrackingService, replacePlaceholders } from '@frontend/vanilla/core';
import { mapValues } from 'lodash-es';

import { LossLimitsConfig } from './loss-limits.client-config';
import { LossLimitsDetails } from './loss-limits.models';

@Injectable()
export class LossLimitsTrackingService {
    constructor(
        private trackingService: TrackingService,
        private lossLimitsConfig: LossLimitsConfig,
    ) {}

    trackLoad(lossLimitsDetails: LossLimitsDetails[]) {
        this.setPlaceholders(lossLimitsDetails);
        this.trackLossLimitsEvent(lossLimitsDetails, 'Load', 'not applicable', 'Loss Limits pop-up');
    }

    trackClose(lossLimitsDetails: LossLimitsDetails[]) {
        this.trackLossLimitsEvent(lossLimitsDetails, 'Click', 'Loss Limits pop-up', 'Close');
    }

    trackLossLimitsEvent(lossLimitsDetails: LossLimitsDetails[], action: string, location: string, details: string) {
        const limitsNotified = this.getLimitsNotified(lossLimitsDetails);
        this.track(action, limitsNotified, location, details);
    }

    private track(action: string, position: string, location: string, details: string) {
        this.trackingService.triggerEvent('Event.OptionLoad', {
            'component.CategoryEvent': 'Gambling Controls',
            'component.LabelEvent': 'Loss Limits',
            'component.ActionEvent': action,
            'component.PositionEvent': position,
            'component.LocationEvent': location,
            'component.EventDetails': details,
            'component.URLClicked': 'not applicable',
        });
    }

    private getLimitsNotified(lossLimitsDetails: LossLimitsDetails[]): string {
        return lossLimitsDetails.reduce((acc: string, current: LossLimitsDetails) => {
            return acc ? `${acc}/${current.notificationType}` : current.notificationType;
        }, '');
    }

    private setPlaceholders(lossLimitsDetails: LossLimitsDetails[]) {
        const limitsNotified = this.getLimitsNotified(lossLimitsDetails);
        const placeholders = {
            limits: limitsNotified,
        };
        if (this.lossLimitsConfig.updateCTA.trackEvent) {
            this.lossLimitsConfig.updateCTA.trackEvent.data = mapValues(this.lossLimitsConfig.updateCTA.trackEvent.data || {}, (value) =>
                replacePlaceholders(value, placeholders),
            );
        }
    }
}
