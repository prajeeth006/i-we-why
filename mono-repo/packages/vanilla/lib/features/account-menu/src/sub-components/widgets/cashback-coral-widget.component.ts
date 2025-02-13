import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

import { CoralCashbackBaseComponent } from '../coral-cashback-base.component';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent],
    selector: 'vn-am-cashback-coral-widget',
    templateUrl: 'cashback-widget.html',
})
export class CashbackCoralWidgetComponent extends CoralCashbackBaseComponent implements OnInit {
    constructor(private trackingService: TrackingService) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
    }
}
