/** @stable */
export interface AdobeTargetOptions {
    mbox?: string;
    timeout?: number;
    params?: { [key: string]: string };
    selector?: any;
}

export interface AdobeTargetBaseOptions extends AdobeTargetOptions {
    success: Function;
    error: Function;
}

export interface AdobeTargetResponse {
    offer: Array<AdobeTargetContent>;
}

export interface AdobeTargetContent {
    content: Array<AdobeTargetOffer>;
}

export interface AdobeTargetOffer {
    itemId: string;
    path: string;
    createdTime: Date;
    previewUrl: string;
}
