import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DslService, DynamicComponentDirective, DynamicHtmlDirective, TrackingService, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { NgxFloatUiModule } from 'ngx-float-ui';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DynamicComponentDirective,
        DynamicHtmlDirective,
        CurrencyPipe,
        PopperContentComponent,
        NgxFloatUiModule,
        IconCustomComponent,
    ],
    selector: 'vn-bonus-balance-header-item',
    templateUrl: './bonus-balance-header-item.component.html',
})
export class BonusBalanceHeaderItemComponent extends AccountMenuItemBase implements OnInit {
    balance: number = 0;
    hideIfZero: boolean;
    expanded: boolean;
    description: string;
    tooltipText: string;

    constructor(
        public dslService: DslService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit() {
        this.dslService.evaluateExpression<number>(this.item.parameters['formula']!).subscribe((x) => (this.balance = x));

        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'mini menu',
            'component.LabelEvent': 'my bonuses',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'bonus and rewards',
            'component.LocationEvent': 'wallet',
            'component.EventDetails': this.item.parameters['description']
                ? `${this.item.text} - ${this.item.parameters['description']}`
                : this.item.text,
            'component.URLClicked': 'not applicable',
        });

        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);
        this.description = this.item.resources['Description']!;
        const tooltipTextRef = this.item.parameters['tooltip-text-ref'];

        if (tooltipTextRef) {
            this.tooltipText = this.item.resources[tooltipTextRef]!;
        }
    }

    expand() {
        this.expanded = !this.expanded;
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'menu',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'wallet',
            'component.LocationEvent': 'menu drawer',
            'component.EventDetails': this.expanded ? 'expand' : 'collapse',
            'component.URLClicked': 'not applicable',
        });
    }

    trackTooltip() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'mini menu',
            'component.LabelEvent': 'my bonuses',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'bonus and rewards',
            'component.LocationEvent': 'wallet',
            'component.EventDetails': 'unavailable tool tip',
            'component.URLClicked': 'not applicable',
        });
    }

    closeClicked(autoClose: boolean) {
        if (!autoClose) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'mini menu',
                'component.LabelEvent': 'my bonuses',
                'component.ActionEvent': 'close',
                'component.PositionEvent': 'bonus and rewards',
                'component.LocationEvent': 'wallet',
                'component.EventDetails': 'unavailable tool tip',
                'component.URLClicked': 'not applicable',
            });
        }
    }
}
