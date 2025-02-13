import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { IntlService, MenuContentItem } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { LoyaltyCashback, LoyaltyCashbackModel } from '../account-menu.models';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'lh-am-loyalty-cashback',
    templateUrl: 'loyalty-cashback.html',
})
export class LoyaltyCashbackComponent extends AccountMenuItemBase implements OnDestroy, OnInit {
    model: LoyaltyCashbackModel;

    private unsubscribe = new Subject<void>();

    constructor(private intlService: IntlService) {
        super();
    }

    ngOnInit() {
        this.accountMenuService.loyaltyCashbackEvents
            .pipe(
                filter((d: LoyaltyCashback | null) => d != null),
                takeUntil(this.unsubscribe),
            )
            .subscribe((data) => {
                if (!data) {
                    return;
                }

                const link = this.getItemLink(data);

                if (!link) {
                    return;
                }

                this.model = {
                    title: this.getCtaTitle(data).replace(
                        '{CASHBACK_AMOUNT}',
                        this.intlService.formatCurrency(data.cashbackAmount, data.cashbackCurrency),
                    ),
                    link: {
                        text: link.text.replace(
                            '{MINIMUM_CASHBACK_AMOUNT}',
                            this.intlService.formatCurrency(data.minEligibleAmount, data.minEligibleAmountCurrency),
                        ),
                        url: link.url,
                        cssClass: link.name === 'minimum' && data.minEligibleAmount > data.cashbackAmount ? 'disabled' : null,
                    },
                };
            });
        this.accountMenuService.updateLoyaltyCashback();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private getCtaTitle(data: LoyaltyCashback): string {
        if (!data.optinStatus) {
            return this.accountMenuService.resources.messages.OptInTitle || '';
        }

        return this.accountMenuService.resources.messages.CashbackTitle || '';
    }

    private getItemLink(data: LoyaltyCashback): MenuContentItem | undefined {
        let itemName = 'available';

        if (!data.optinStatus) {
            itemName = 'optin';
        }

        if ((data.minEligibleAmount || 0) > (data.cashbackAmount || 0)) {
            itemName = 'minimum';
        }

        return this.item.children.find((item: MenuContentItem) => item.name === itemName);
    }
}
