import { ChangeDetectorRef, Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';

import { NativeAppService, NavigationService, ViewTemplateForClient, WINDOW, trackByProp } from '@frontend/vanilla/core';
import { OfferResponse, OfferStatus } from '@frontend/vanilla/shared/offers';
import { MobileGameInfo, NotificationMessage, RtmsCtaAction, RtmsCtaActionTypes, RtmsMessageType } from '@frontend/vanilla/shared/rtms';

@Directive()
export abstract class RtmsOverlayComponentBase implements OnInit, OnChanges {
    static metaData = {
        inputs: ['message', 'content'],
        outputs: ['closeEvent'],
    };

    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    @Output() tacExpandedEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() message: NotificationMessage;
    @Input() content: Partial<ViewTemplateForClient>;

    isTacExpanded: boolean;
    headerTitle: string;
    overlayImage: string;
    title: string;
    description: string;
    isOfferClaimed: boolean;
    tacOffsetTop: number;
    imageSubtitleText: string;
    imageTitleText: string;
    imageTextAlignment: string;
    imageIntroductoryText: string;
    imageTitleFontSize: string;
    changeDetectorRef = inject(ChangeDetectorRef);
    readonly trackByTitle = trackByProp<MobileGameInfo>('title');

    private navigation = inject(NavigationService);
    private nativeApplication = inject(NativeAppService);

    readonly #window = inject(WINDOW);

    ngOnInit() {
        this.content = this.content || {
            form: {},
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.message?.currentValue) {
            this.message.mobileGameList = this.message.mobileGameList || [];
            this.message.desktopGameList = this.message.desktopGameList || [];
            this.message.mobileAllList = this.message.mobileAllList || [];
            this.message.desktopAllList = this.message.desktopAllList || [];
            this.message.desktopSectionGamesPairs = this.message.desktopSectionGamesPairs || [];
            this.message.mobileSectionGamesPairs = this.message.mobileSectionGamesPairs || [];
            this.message.mobileGames = this.message.mobileGames || [];
            this.message.desktopGames = this.message.desktopGames || [];

            this.handleSitecoreTncMsgConfiguration(this.message);

            if (this.message.content.useRewardsOverlay) {
                if (this.message.messageType === RtmsMessageType.BONUS_OFFER) this.message.sourceStatus = this.message.bonusSourceStatus;
                if (
                    this.message.sourceStatus === OfferStatus.OFFER_CLAIMED ||
                    this.message.sourceStatus === OfferStatus.OPTED_IN ||
                    this.message.sourceStatus === OfferStatus.OPTEDIN
                ) {
                    this.showPostAcceptanceContent();
                    this.isOfferClaimed = true;
                } else {
                    this.showPreAcceptanceContent();
                    this.isOfferClaimed = false;
                }
            }
        }
    }

    close() {
        this.closeEvent.emit();
    }

    getSectionTitle(sectionTitle: string): string {
        return this.content.messages!['GameSection.' + sectionTitle.replace(' ', '')] || sectionTitle;
    }

    goTo(linkUrl: string) {
        if (linkUrl) {
            if (this.nativeApplication.isNativeApp) {
                this.#window.location.href = linkUrl;
            } else {
                this.navigation.goTo(linkUrl, { forceReload: true });
            }
        }
    }

    rtmsCtaActions(action: RtmsCtaAction) {
        switch (action.type) {
            case RtmsCtaActionTypes.hideRtms:
                this.close();
                break;
            case RtmsCtaActionTypes.claimOfferSuccess:
                this.claimOfferSuccess(action.value);
                break;
        }
    }

    claimOfferSuccess(response: OfferResponse) {
        if (response) {
            this.message.bonusSourceStatus = response.status;
            this.showPostAcceptanceContent();
            this.isOfferClaimed = true;
            this.changeDetectorRef.detectChanges();
        }
    }

    tacExpanded() {
        this.isTacExpanded = !this.isTacExpanded;
        this.tacExpandedEvent.next(this.isTacExpanded);
    }

    redirectTo(url: string) {
        this.navigation.goTo(url);
    }

    private handleSitecoreTncMsgConfiguration(messageDetails: NotificationMessage) {
        if (
            messageDetails.content &&
            messageDetails.content.showManualTermsAndConditionsOnOverlay &&
            messageDetails.content.overlayManualTermsAndConditions
        ) {
            messageDetails.isShowTnc = true;
            messageDetails.tnCData = messageDetails.content.overlayManualTermsAndConditions;
        } else {
            messageDetails.isShowTnc = !!(messageDetails.isTnCTemplate && messageDetails.tnCData);
        }
    }

    private showPreAcceptanceContent() {
        this.headerTitle = this.message.content.preAcceptanceHeaderTitle;
        this.overlayImage = this.message.content.preAcceptanceImage;
        this.title = this.message.content.preAcceptanceTitle;
        this.description = this.message.content.preAcceptanceDescription;

        this.imageIntroductoryText = this.message.content.preAcceptanceImageIntroductoryText;
        this.imageTitleText = this.message.content.preAcceptanceImageTitleText;
        this.imageSubtitleText = this.message.content.preAcceptanceImageSubtitleText;
        this.imageTextAlignment = this.message.content.preAcceptanceImageTextAlignment;
        this.imageTitleFontSize = this.message.content.preAcceptanceImageTitleFontSize;
    }

    private showPostAcceptanceContent() {
        this.headerTitle = this.message.content.postAcceptanceHeaderTitle;
        this.overlayImage = this.message.content.postAcceptanceImage;
        this.title = this.message.content.postAcceptanceTitle;
        this.description = this.message.content.postAcceptanceDescription;
        this.isOfferClaimed = true;

        this.imageIntroductoryText = this.message.content.postAcceptanceImageIntroductoryText;
        this.imageTitleText = this.message.content.postAcceptanceImageTitleText;
        this.imageSubtitleText = this.message.content.postAcceptanceImageSubtitleText;
        this.imageTextAlignment = this.message.content.postAcceptanceImageTextAlignment;
        this.imageTitleFontSize = this.message.content.postAcceptanceImageTitleFontSize;
    }
}
