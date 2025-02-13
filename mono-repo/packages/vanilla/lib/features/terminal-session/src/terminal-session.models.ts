import { TimeSpan } from '@frontend/vanilla/core';

export interface TerminalSession {
    brand: string;
    shopId: number;
    terminalId: string;
    cumulativeBalance: number; // In cents
}

export interface TerminalSessionNotification {
    timeActive: TimeSpan;
    cumulativeBalance: number; // In cents
}
