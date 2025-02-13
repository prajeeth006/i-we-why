/**
 * @stable
 */
export interface OfferResponse {
    status: OfferStatus;
}

/**
 * @stable
 */
export enum OfferStatus {
    OFFER_NEW = 'OFFER_NEW',
    OFFER_TNC_ACCEPTED = 'OFFER_TNC_ACCEPTED',
    OFFER_CLAIMED = 'OFFER_CLAIMED',
    OFFER_DROPPED = 'OFFER_DROPPED',
    OFFER_EXPIRED = 'OFFER_EXPIRED',
    OFFERED = 'OFFERED',
    NOTOFFERED = 'NOTOFFERED',
    NOT_OFFERED = 'NOT_OFFERED',
    EXPIRED = 'EXPIRED',
    OPTEDIN = 'OPTEDIN',
    OPTED_IN = 'OPTED_IN',
    OPTEDOUT = 'OPTEDOUT',
    OPTED_OUT = 'OPTED_OUT',
    INVALID = 'INVALID',
    NO_OFFER = 'NO_OFFER',
}

/**
 * @stable
 */
export interface KeyValue {
    key: string;
    value: number;
}

/**
 * @stable
 */
export enum OfferType {
    EDS = 'eds',
    BONUSES = 'bonuses',
    PROMOS = 'promos',
    EDS_GROUP = 'edsgroup',
}
