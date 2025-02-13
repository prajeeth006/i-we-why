import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { NgxFloatUiModule } from 'ngx-float-ui';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuTrackingService } from '../account-menu-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, PopperContentComponent, NgxFloatUiModule],
    selector: 'vn-am-verification-status',
    templateUrl: 'verification-status.html',
})
export class VerificationStatusComponent extends AccountMenuItemBase implements OnInit {
    constructor(private trackingService: AccountMenuTrackingService) {
        super();
    }

    ngOnInit() {
        this.trackingService.trackVerificationStatusLoad(this.item.name);
    }

    toggle() {
        this.trackingService.trackVerificationStatusClick(this.item.name);
        this.trackingService.trackVerificationStatusTooltipLoad(`${this.item.name} downboard`);
    }
}
