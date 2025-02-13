import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownTrackingService } from '../balance-breakdown-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, IconCustomComponent],
    templateUrl: 'expander.html',
    selector: 'vn-bb-expander',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/balance-breakdown/bb-expander/styles.scss'],
    encapsulation: ViewEncapsulation.None,

    animations: [
        trigger('toggleAnimation', [
            state('0', style({ height: '0px' })),
            transition('1 => 0', animate('.2s ease', style({ height: '0px' }))),
            transition('0 => 1', animate('.2s ease', style({ height: '*' }))),
        ]),
    ],
})
export class ExpanderComponent extends BalanceBreakdownItemBase implements OnInit {
    expanded: boolean = false;
    expanderItem: MenuContentItem | undefined;
    expandableItems: MenuContentItem[];
    skipProductTracking: boolean;

    constructor(private balanceTrackingService: BalanceBreakdownTrackingService) {
        super();
    }

    ngOnInit() {
        this.expanderItem = this.item.children.find((x) => x.name == this.item.parameters['expander-item']);
        this.expandableItems = this.item.children.filter((x) => x !== this.expanderItem);
        this.skipProductTracking = !!toBoolean(this.item.parameters['skip-product-tracking']);
    }

    expand() {
        this.expanded = !this.expanded;
        this.balanceTrackingService.trackExpandBalance(
            this.expanded ? 'expand' : 'collapse',
            this.expanderItem?.name || '',
            this.skipProductTracking ? 'not applicable' : this.balanceBreakdownService.slide()?.name,
        );
    }
}
