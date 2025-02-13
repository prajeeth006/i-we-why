import { InjectionToken } from '@angular/core';

export const GridCardEventName = 'GridCard';
export const ConnectCardEventName = 'NfcIdCard';
export const ANONYMOUS_IDENTIFIER = 'anonymous';
export enum NFCCardType {
    GRID = 'GRID',
    CONNECT = 'CONNECT',
}

export const BETSTATION_LOGIN_ERROR = new InjectionToken<String>('BETSTATION_LOGIN_ERROR');
export const CARD_NUMBER = new InjectionToken<string>('CARD_NUMBER');
export const MESSAGE_DATA = new InjectionToken<MessageData>('MESSAGE_DATA');

export class MessageData {
    title: string;
    text: string;
}
