import { LogoutOptions } from '@frontend/vanilla/core';

export enum InactivityMode {
    Betstation = 'Betstation',
    Web = 'Web',
}

export enum WebVersion {
    Version1 = 1,
    Version2 = 2,
}

export interface InactivityLogoutOptions extends LogoutOptions {
    event?: Event;
    closeOverlay: boolean;
    showLoginDialog: boolean;
}
