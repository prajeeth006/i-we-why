import { OfferResponse } from '@frontend/vanilla/shared/offers';

import { InboxMessage } from './services/inbox.models';

export enum InboxMessageActionType {
    MessageSelected = 'MessageSelected',
    MessagesRemoveClicked = 'MessagesRemoveClicked',
    MessagesRemoved = 'MessagesRemoved',
    MessageClicked = 'MessageClicked',
    LoadMoreMessages = 'LoadMoreMessages',
}

export enum CtaActionType {
    HideInbox = 'HideInbox',
    ClaimOfferSuccess = 'ClaimOfferSuccess',
}

export interface InboxAction {
    type: InboxMessageActionType;
    value?: InboxMessage;
}

export interface InboxMessageUpdateStatusResponse {
    isUpdated: boolean;
    result: string;
}

export interface CtaAction {
    type: CtaActionType;
    value?: OfferResponse;
}
