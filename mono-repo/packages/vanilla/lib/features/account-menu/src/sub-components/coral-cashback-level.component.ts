import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { ClaimsService, MenuContentItem } from '@frontend/vanilla/core';
import { ImageComponent } from '@frontend/vanilla/shared/image';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, ImageComponent],
    selector: 'lh-am-coral-cashback-level',
    templateUrl: 'coral-cashback-level.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/coral-cashback/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CoralCashbackLevelComponent implements OnInit {
    @Input() item: MenuContentItem;
    model: MenuContentItem | undefined;

    constructor(private claimService: ClaimsService) {}

    ngOnInit() {
        const vipLevel = this.claimService.get('vipLevel');
        this.model = this.item.children.find((item: MenuContentItem) => item.name.toLowerCase() === 'level_' + (vipLevel || 'nonvip').toLowerCase());
    }
}
