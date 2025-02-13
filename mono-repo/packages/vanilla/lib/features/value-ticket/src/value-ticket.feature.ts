import { runOnFeatureInit } from '@frontend/vanilla/core';

import { ValueTicketBootstrapService } from './value-ticket-bootstrap.service';
import { ValueTicketResourceService } from './value-ticket-resource.service';
import { ValueTicketTrackingService } from './value-ticket-tracking.service';
import { ValueTicketService } from './value-ticket.service';

export function provide() {
    return [ValueTicketService, ValueTicketTrackingService, ValueTicketResourceService, runOnFeatureInit(ValueTicketBootstrapService)];
}
