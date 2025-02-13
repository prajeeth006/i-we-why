import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CashierService, Page } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { RtmsLayerConfig } from '@frontend/vanilla/shared/rtms';

import { BonusResourceService } from '../../bonus-resource.service';
import { RtmsOverlayComponentBase } from './rtms-overlay-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, ImageComponent, IconCustomComponent],
    selector: 'vn-rtms-bonus-teaser',
    templateUrl: 'rtms-bonus-teaser.component.html',
})
export class RtmsBonusTeaserComponent extends RtmsOverlayComponentBase implements OnInit {
    public bonusHeader: string = '';
    private bonusTeaserRedirectUrl: string;

    constructor(
        private bonusResourceService: BonusResourceService,
        public rtmsConfig: RtmsLayerConfig,
        public page: Page,
        private cashierService: CashierService,
    ) {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.message.content.bonusHeader) {
            this.bonusHeader = this.message.content.bonusHeader.replace(/<[^>]*>/g, '');
        }
        this.bonusTeaserRedirectUrl = this.rtmsConfig.bonusTeaserRedirectUrl.replace('{culture}', this.page.lang);
    }

    decline() {
        // drop bonus
        this.bonusResourceService.dropBonusOffer({ bonusId: this.message.bonusId, agentName: 'System', reason: 'PLP' }).subscribe(() => this.close());
    }

    accept() {
        // is bonus tnc is accepted and it is deposit bonus, redirect to cashier
        if (this.message.isBonusTncAccepted) {
            this.postTncAcceptanceAction();
        } else {
            // try to accept bonus tnc
            this.bonusResourceService
                .updateBonusTncAcceptance({
                    offerId: +this.message.offerId,
                    offerArc: 1,
                    isCampaignBonus: this.message.isCampaignBonus,
                    tncAcceptanceFlag: true,
                })
                .subscribe((update: boolean) => {
                    if (update) {
                        this.postTncAcceptanceAction();
                    } else {
                        this.close();
                    }
                });
        }
    }

    private postTncAcceptanceAction() {
        this.close();
        if (this.message.isNoDepositBonus) {
            // if it is no deposit bonus redirect to bonus page
            this.redirectTo(this.bonusTeaserRedirectUrl);
        } else {
            // if it is deposit bonus redirect to cashier
            this.goToCashier(this.message.bonusCode);
        }
    }

    private goToCashier(bonusCode: any) {
        this.cashierService.goToCashierDeposit({
            returnUrl: this.bonusTeaserRedirectUrl,
            skipQuickDeposit: true,
            queryParameters: { ['bonusCodeForPrefill']: bonusCode },
        });
    }
}
