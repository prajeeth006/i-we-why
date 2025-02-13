import { InjectionToken } from '@angular/core';

export const VALUE_TICKET_DATA = new InjectionToken<ValueTicketData>('vn-value-ticket-data');

export interface ValueTicketData extends ValueTicketResponse {
    source: string;
    transactionDate: string;
}

export interface ValueTicketRequest {
    id: string;
    source: string;
    shopId: string;
    terminalId: string;
    reqRefId: string;
}

export interface ValueTicketError {
    status: string;
    valueTicketStatus: string;
}

export interface ValueTicketResponse {
    valueTicketId: string;
    valueTicketStatus: string;
    currency: string;
    amount: number;
    shopId: string;
    terminalId: string;
    terminalIdPaidOut?: string;
    agentName: string;
    comments: string;
    status: string;
    errorCode?: string;
    errorMsg?: string;
    amlCurrentStatus?: string;
}

export interface ValueTicketErrorResponse {
    errorCode?: string;
    message?: string;
}

export interface PayoutValueTicketRequest {
    id: string;
    agentName: string;
    description: string;
    shopId: string;
    source: string;
    terminalId: string;
}

export interface PayoutValueTicketResponse {
    amount: number;
    currency: string;
    errorCode: string;
    errorDesc: string;
    status: string;
    transactionDate: string;
    valueTicketStatus: string;
    wltRefId: number;
}

export interface ValueTicketDialogContent {
    title: string | undefined;
    text: string | undefined;
    type?: ValueTicketDialogType;
    status?: ValueTicketStatus;
    closeButtonText?: string;
    acceptButtonText?: string;
}

export enum TicketStatus {
    SUCCESS = 'SUCCESS',
    BLOCKED = 'BLOCKED',
    REJECTED = 'REJECTED',
    CLEARED = 'CLEARED',
    FAILED = 'FAILED',
}

export enum ValueTicketStatus {
    // From response
    PAID_OUT = 'PAID_OUT',
    PRINTED = 'PRINTED',
    VALUETICKET_VALIDATION_ERROR = 'VALUETICKET_VALIDATION_ERROR',
    SHOP_ID_MISS_MATCH = 'SHOP_ID_MISS_MATCH',
    VALUE_TICKET_ALREADY_PAID = 'VALUE_TICKET_ALREADY_PAID',
    ORC_DEPOSIT_LIMIT_EXCEED_01 = 'ORC_DEPOSIT_LIMIT_EXCEED_01',

    // Custom types
    BLOCKED = 'BLOCKED',
    SCANNED = 'SCANNED',
    PAID_OUT_SCAN = 'PAID_OUT_SCAN',
    DEPOSIT_FAILED = 'DEPOSIT_FAILED',
    GENERAL_ERROR = 'GENERAL_ERROR',
}

export enum ValueTicketDialogType {
    Error = 'error',
    Info = 'info',
    Success = 'success',
    Question = 'question',
}
