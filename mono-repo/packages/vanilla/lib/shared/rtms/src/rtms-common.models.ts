import { ContentImage, RtmsMessage, RtmsType } from '@frontend/vanilla/core';
import { OfferStatus } from '@frontend/vanilla/shared/offers';

export class RtmsLayerMessageRequest {
    constructor(
        public messageId: string,
        public templateId: string,
        public messageType: string,
        public campaignId: string,
        public templateMetaData: { [key: string]: string },
        public source?: string,
    ) {}
}

export class RamsLayerMessageResponse {
    messages: NotificationMessage[];
}

export class NotificationMessageContent {
    overlayHeaderType: NotificationMessageHeaderType;
    overlayImage: string;
    overlayCallToAction: string;
    overlayDescription: string;
    overlayTitle: string;
    overlayImageSubtitleText: string;
    overlayImageTextAlignment: string;
    overlayImageIntroductoryText: string;
    overlayImageTitleFontSize: string;
    overlayImageTitleText: string;
    restrictedOverlay: boolean;
    toasterTitle: string;
    tosterImage: string;
    toasterCallToAction: string;
    toasterPrimaryGhostCallToAction: string;
    toasterCloseCallToActionLabel: string;
    toasterDescription: string;
    toasterCloseAfterTimeout: boolean;
    useRewardsOverlay: boolean;
    preAcceptanceHeaderTitle: string;
    preAcceptanceImage: string;
    preAcceptanceTitle: string;
    preAcceptanceDescription: string;
    preAcceptanceKeyTerms: string;
    preAcceptanceCTA1: string;
    preAcceptanceCTA2: string;
    preAcceptanceImageSubtitleText: string;
    preAcceptanceImageTitleText: string;
    preAcceptanceImageTextAlignment: string;
    preAcceptanceImageIntroductoryText: string;
    preAcceptanceImageTitleFontSize: string;
    showManualTermsAndConditionsOnOverlay: boolean;
    overlayManualTermsAndConditions: string;
    postAcceptanceHeaderTitle: string;
    postAcceptanceImage: string;
    postAcceptanceTitle: string;
    postAcceptanceDescription: string;
    postAcceptanceCTA: string;
    postAcceptanceImageSubtitleText: string;
    postAcceptanceImageTitleText: string;
    postAcceptanceImageTextAlignment: string;
    postAcceptanceImageIntroductoryText: string;
    postAcceptanceImageTitleFontSize: string;
    bonusHeader: string;
    bonusText: string;
    bonusImage: ContentImage;
    headerTermsAndConditionsToaster: string;
    headerTermsAndConditionsOverlay: string;
    headerTermsAndConditionsRewardsOverlay: string;
}

export enum NotificationMessageHeaderType {
    DEFAULT = 'Default',
    LOGO = 'Logo',
    TRANSPARENT = 'Transparent',
}

export class NotificationMessage {
    id: string;
    messageType: RtmsMessageType;

    sourceStatus: OfferStatus;

    content: NotificationMessageContent;

    /** @description OfferId or CampaignId if OfferId is empty(to eds, pat) */
    offerId: string;
    isNoDepositBonus: boolean;
    bonusCode: string;
    isTnCTemplate: boolean;
    tnCData: string;
    isShowTnc: boolean;
    sitecoreId: string;
    desktopGameList: Array<MobileGameInfo>; //title, section title, id
    mobileGameList: Array<MobileGameInfo>; //title, section title, id
    desktopAllList: Array<GameAllInfo>;
    mobileAllList: Array<GameAllInfo>;
    desktopSectionGamesPairs: Array<KeyValuePair<string, Array<MobileGameInfo>>>;
    mobileSectionGamesPairs: Array<KeyValuePair<string, Array<MobileGameInfo>>>;
    isAllMobileGames: boolean;
    isAllDesktopGames: boolean;
    casinoHomeLink: string;
    channelId: string;
    casinoHomeNativeLink: string;
    casinoAllGamesIconSrc: string;
    bonusSourceStatus: OfferStatus;
    campaignId: string;
    isBonusTeaser: string;
    isCampaignBonus: boolean;
    bonusId: string;
    isBonusTncAccepted: boolean;

    desktopSectionGamesViewModel: SectionGamesViewModel[];
    mobileSectionGamesViewModel: SectionGamesViewModel[];

    desktopGames: Array<MobileGameInfo>; //all meta info to view and launch
    mobileGames: Array<MobileGameInfo>; //all meta info to view and launch

    desktopGameTitles: string;
    mobileGameTitles: string;

    isGamesLoadFailed: boolean;
    private _isErrorMessage: boolean;

    get isErrorMessage(): boolean {
        return this._isErrorMessage;
    }

    static ErrorMessage(id: string): NotificationMessage {
        const err: NotificationMessage = new NotificationMessage();
        err.id = id;
        err._isErrorMessage = true;
        return err;
    }
}

export enum RtmsMessageType {
    EDS_OFFER = <any>'EDS_OFFER',
    EDS_REWARD = <any>'EDS_REWARD',
    PROMO_TARGET = <any>'PROMO_TARGET',
    PROMO_REWARD = <any>'PROMO_REWARD',
    CMS_OFFER = <any>'CMS_OFFER',
    BONUS_OFFER = <any>'BONUS_OFFER',
}

export class GameAllInfo {
    sectionTitle: string;
    link: string;
}

export class MobileGameInfo {
    launchUrl: string;
    title: string;
    icon: MobileGameIconInfo;
    gameId: string;
    internalGameName: string;
    categoryTitle: string;
}

export class MobileGameIconInfo {
    src: string;
    width: number;
    height: number;
}

export class SectionGamesViewModel {
    constructor(
        public title: string,
        public value: string,
    ) {}
}

export class KeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export class RtmsMessagePayload {
    accountName: string;
    baseTempletId: string;
    applicableProducts: Array<string>;
    offerTypes: Array<string>;
    additionalInfo: { [key: string]: string };
    campaignId: string;
    notificationType: string;
    source?: string;

    get baseTemplateId() {
        return this.baseTempletId;
    }
}

export class RtmsMessageEx implements RtmsMessage {
    payload: RtmsMessagePayload;
    type: RtmsType;
    messageId: string;
    destinationUserName: string;
    eventId: string;

    get eventInfo(): RtmsMessageEventInfo {
        return { messageType: this.type, campaignId: this.payload.campaignId };
    }
}

export class RtmsMessageEventInfo {
    messageType: string;
    campaignId: string;
}

export class SubDomainModel {
    constructor(
        public type: string,
        public key: string,
        public value?: string,
    ) {}

    public static isReadModel(model: SubDomainModel): model is SubDomainReadModel {
        return model && (<SubDomainReadModel>model).id !== undefined;
    }
}

export class SubDomainReadModel extends SubDomainModel {
    constructor(
        public id: number,
        public override type: string,
        public override key: string,
        public override value?: string,
    ) {
        super(type, key, value);
    }
}

export interface SubDomainCallback {
    (key: string, value: string | undefined): void;
}

export interface SubDomainRequestsMap {
    [key: number]: SubDomainRequest;
}

export class SubDomainRequest {
    constructor(
        public request: SubDomainModel,
        public callback?: SubDomainCallback,
    ) {}
}

export class SubDomainEventResponse {
    data: SubDomainModel;
}

export class RtmsCtaAction {
    constructor(
        public type: RtmsCtaActionTypes,
        public value?: any,
    ) {}
}

export enum RtmsCtaActionTypes {
    hideRtms,
    claimOfferSuccess,
}

export enum RtmsCtaType {
    Cta = 1,
    Eds = 2,
    Pat = 3,
}

export class NotificationMessageWithType {
    notification: NotificationMessage;
    type: RtmsType;
}
