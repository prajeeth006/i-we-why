import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DsBonusButton } from '@frontend/ui/bonus-button';
import { CurrencyPipe, Page, TrackingService } from '@frontend/vanilla/core';

import { HeaderItemBase } from '../header-item-base';
import { HeaderService } from '../header.service';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DsBonusButton],
    selector: 'vn-h-bonus-balance',
    templateUrl: 'bonus-balance.html',
})
export class BonusBalanceComponent extends HeaderItemBase implements OnInit {
    constructor(
        public headerService: HeaderService,
        private config: Page,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'navigation',
            'component.LabelEvent': 'mini menu',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': this.config.product,
            'component.EventDetails': 'bonus screen',
            'component.URLClicked': 'not applicable',
        });
    }
}
