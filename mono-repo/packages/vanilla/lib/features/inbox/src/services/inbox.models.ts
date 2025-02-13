import { OfferStatus } from '@frontend/vanilla/shared/offers';

/**
 * @stable
 */
export class MessageContent {
    detailTitle: string;
    detailImage: InboxDetailImage;
    detailDescription: string;
    detailCallToAction: string;
    shortImage: string;
    snippetTitle: string;
    snippetDescription: string;
    snippetCallToAction: string;
    showManualTermsAndConditions: boolean;
    isManualTermsAndConditionsEmpty: boolean;
    manualTermsAndConditions?: string;
    expandTermsAndConditionsByDefault: boolean;
    headerTermsAndConditionsInbox: string;
    inboxImageTitleText: string;
    inboxImageIntroductoryText: string;
    inboxImageSubtitleText: string;
    inboxImageTitleFontSize: string;
    inboxImageTextAlignment: string;
}

/**
 * @stable
 */
export class InboxDetailImage {
    detailImage: string;
    detailImageLink: string;
    detailImageAttrs: { [key: string]: string };
}

/**
 * @stable
 */
export class MessageData {
    id: string;
    createdDate: Date;
    eligibleProducts: string[];
    messageSource: string;
    messageStatus: MessageStatus;
    messageType: MessageType;
    priority: number;
    sourceStatus: OfferStatus;
    content: MessageContent;
    isExpired: boolean;
    isNew: boolean;
    isNoDepositBonus: boolean;
    isTnCTemplate: boolean;
    tnCData: string;
    sitecoreId: string;
    isAllMobileGames: boolean;
    isAllDesktopGames: boolean;
    casinoHomeLink: string;
    channelId: string;
}

/**
 * @stable
 */
export class InboxMessage extends MessageData {
    selected: boolean;
    mobileGameList: any;
    desktopGameList: any;
    mobileAllList: { sectionTitle: string; link: string }[];
    desktopAllList: { sectionTitle: string; link: string }[];
    mobileChannelList: string[];
    desktopChannelList: string[];
    desktopSectionGamesPairs: any;
    mobileSectionGamesPairs: any;
    desktopSectionGamesViewModel: { title: string; value: string }[];
    mobileSectionGamesViewModel: { title: string; value: string }[];
    desktopGames: any;
    desktopGameTitles: any;
    mobileGames: any;
    mobileGameTitles: any;
    bonusCode: string;
    offerId: string;
    isTnCViewed?: boolean | undefined; // Optional undefined
    bonusSourceStatus: OfferStatus;
}

/**
 * @stable
 */
export class InboxGetListResponse {
    messages: InboxMessage[];
    actualReceivedNumberOfMessages: number;
}

/**
 * @stable
 */
export class InboxGetCountResponse {
    count: number;
}

/**
 * @stable
 */
export enum MessageStatus {
    unread = 'unread',
    read = 'read',
    new = 'new',
}

/**
 * @stable
 */
export enum StatusType {
    all = 'ALL',
    new = 'NEW',
}

/**
 * @stable
 */
export enum MessageType {
    EDS_OFFER = 'EDS_OFFER',
    EDS_REWARD = 'EDS_REWARD',
    PROMO_TARGET = 'PROMO_TARGET',
    PROMO_REWARD = 'PROMO_REWARD',
    CMS_OFFER = 'CMS_OFFER',
    BONUS_OFFER = 'BONUS_OFFER',
}
