import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { InboxService, NavigationService, ProductHomepagesConfig, ViewTemplateForClient } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { KycStatus, KycStatusService } from '@frontend/vanilla/shared/kyc';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InboxCtaActionComponent } from '../component-helpers/inbox-cta-action.component';
import { CtaAction, CtaActionType } from '../inbox.models';
import { CrappyInboxService } from '../services/crappy-inbox.service';
import { InboxTrackingService } from '../services/inbox-tracking.service';
import { InboxConfig } from '../services/inbox.client-config';
import { InboxMessage } from '../services/inbox.models';
import { InboxDesktopGameListComponent } from './inbox-desktop-game-list.component';
import { InboxMobileGameListComponent } from './inbox-mobile-game-list.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TrustAsHtmlPipe,
        ImageComponent,
        InboxDesktopGameListComponent,
        InboxMobileGameListComponent,
        InboxCtaActionComponent,
        IconCustomComponent,
    ],
    selector: 'lh-inbox-details',
    templateUrl: 'inbox-details.component.html',
})
export class InboxDetailsComponent implements OnChanges, OnDestroy {
    @Output() action: EventEmitter<CtaAction> = new EventEmitter();
    @Input() message: InboxMessage;
    @Input() content: ViewTemplateForClient;

    isTacExpanded: boolean;
    showJumioTriggerButton: boolean = false;
    showCallToActionButton: boolean = true;
    showTermsAndConditions: boolean = false;
    termsAndConditionsTitle: string;
    termsAndConditionsData: string | undefined;

    private unsubscribe = new Subject<void>();

    constructor(
        private crappyInboxService: CrappyInboxService,
        private vanillaNavigation: NavigationService,
        private inboxConfig: InboxConfig,
        private productHomepages: ProductHomepagesConfig,
        private kycStatusService: KycStatusService,
        private tracking: InboxTrackingService,
        private inboxService: InboxService,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['message']?.currentValue) {
            const showManualTnc = this.message.content.showManualTermsAndConditions && !this.message.content.isManualTermsAndConditionsEmpty;
            const showBonusTnc = this.message.isTnCTemplate && !!this.message.tnCData;
            this.showTermsAndConditions = showManualTnc || showBonusTnc;
            this.isTacExpanded = showManualTnc && this.message.content.expandTermsAndConditionsByDefault;
            this.termsAndConditionsTitle = this.content.messages
                ? showManualTnc
                    ? this.content.messages['ManualTermsAndConditions']!
                    : this.content.messages['TermsAndConditions']!
                : '';
            this.termsAndConditionsData = showManualTnc ? this.message.content.manualTermsAndConditions : this.message.tnCData;
            this.message.mobileGameList = this.message.mobileGameList ? this.message.mobileGameList : [];
            this.message.desktopGameList = this.message.desktopGameList ? this.message.desktopGameList : [];
            this.message.mobileAllList = this.message.mobileAllList ? this.message.mobileAllList : [];
            this.message.desktopAllList = this.message.desktopAllList ? this.message.desktopAllList : [];
            this.message.mobileChannelList = this.message.mobileChannelList ? this.message.mobileChannelList : [];
            this.message.desktopChannelList = this.message.desktopChannelList ? this.message.desktopChannelList : [];
            this.message.desktopSectionGamesPairs = this.message.desktopSectionGamesPairs ? this.message.desktopSectionGamesPairs : [];
            this.message.mobileSectionGamesPairs = this.message.mobileSectionGamesPairs ? this.message.mobileSectionGamesPairs : [];
            this.message.mobileGames = [];
            this.message.desktopGames = [];

            if (this.message.mobileGameList.length) {
                // get mobile games metadata
                this.message.mobileGameTitles = this.getGameTitlesUniqueByGameSections(
                    this.message.mobileGameList,
                    this.message.mobileSectionGamesPairs,
                );
            }

            if (this.message.desktopGameList.length) {
                this.message.desktopGameTitles = this.getGameTitlesUniqueByGameSections(
                    this.message.desktopGameList,
                    this.message.desktopSectionGamesPairs,
                );
            }

            this.message.desktopSectionGamesViewModel = this.convertGameSectionPairsToView(this.message.desktopSectionGamesPairs);
            this.message.mobileSectionGamesViewModel = this.convertGameSectionPairsToView(this.message.mobileSectionGamesPairs);

            if (this.inboxConfig.triggerJumioFromPlayerInbox && this.message.messageSource === 'COMPLIANCE') {
                this.showCallToActionButton = false;
                this.kycStatusService.kycStatus
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe((status: KycStatus | null) => (this.showJumioTriggerButton = !!status && !status.kycVerified));
            }

            this.tracking.trackMessageOpened(this.message);
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    triggerJumio() {
        this.tracking.trackKycVerifyClicked().then(() => {
            this.inboxService.close();
            this.vanillaNavigation.goTo(this.productHomepages.portal + this.inboxConfig.jumioKycUrl);
        });
    }

    inboxCtaActions(action: CtaAction) {
        switch (action.type) {
            case CtaActionType.HideInbox:
                this.action.emit(action);
                break;
            case CtaActionType.ClaimOfferSuccess:
                this.claimOfferSuccess(action.value);
        }
    }

    renderImageLink(): boolean {
        if (!this.message.content.detailImage.detailImageLink) {
            return false;
        }

        return !this.message.content.detailImage.detailImageLink.includes('inbox://cta');
    }

    getDetailImageLink(): string {
        const detailImage = this.message.content.detailImage;

        if (this.crappyInboxService.isDepositBonusLink(detailImage.detailImageLink, detailImage.detailImageAttrs)) {
            return this.crappyInboxService.getDepositBonusLink(detailImage.detailImageLink, detailImage.detailImageAttrs);
        }

        return detailImage.detailImageLink;
    }

    toggleTacExpanded() {
        this.isTacExpanded = !this.isTacExpanded;
        this.message.isTnCViewed = true; // added for tracking only
    }

    private getSectionTitle(sectionTitle: string): string {
        return this.content.messages!['GameSection.' + sectionTitle.replace(' ', '')] || sectionTitle;
    }

    private claimOfferSuccess(response: any) {
        if (response.status) {
            // update message status
            this.message.sourceStatus = response.status;
        }
    }

    private getGameTitlesUniqueByGameSections(gameList: any, sectionGamesPairs: any): string {
        const gamesTitlesFromSectionsStr = this.selectMany(sectionGamesPairs)
            .map((m: any) => {
                return this.getUniqueStr(m.title);
            })
            .join(',');

        return gameList
            .filter((m: any) => {
                return gamesTitlesFromSectionsStr.indexOf(this.getUniqueStr(m.title)) === -1;
            })
            .map((m: any) => {
                return m.title;
            })
            .join(', ');
    }

    private selectMany(source: any[]): any[] {
        let res: any[] = [];

        for (let i = 0; i < source.length; i++) {
            const current = source[i];
            const currentList = current.value;

            if (currentList && currentList.length) {
                res = res.concat(currentList);
            }
        }

        return res;
    }

    private getUniqueStr(str: string): string {
        return '__|' + str + '|__';
    }

    private convertGameSectionPairsToView(gameSectionPairs: any): any {
        return gameSectionPairs.map((current: any) => {
            return {
                title: this.getSectionTitle(current.key),
                value: current.value
                    .map((currentVal: any) => {
                        return currentVal.title;
                    })
                    .join(', '),
            };
        });
    }
}
