import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { CurrencyPipe, DslService, MenuActionOrigin, MenuActionsService, MenuContentItem, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { Observable } from 'rxjs';

import { AccountMenuService } from '../account-menu.service';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-am-balance-header-item',
    templateUrl: 'balance-header-item.html',
})
export class AccountMenuBalanceHeaderItemComponent implements OnInit {
    @Input() item: MenuContentItem;
    @Input() mode: string;

    mainBalance: boolean;
    balance: Observable<number>;
    hideArrow: boolean = false;

    constructor(
        public accountMenuService: AccountMenuService,
        private menuActionsService: MenuActionsService,
        public dslService: DslService,
    ) {}

    ngOnInit() {
        this.mainBalance = !!toBoolean(this.item.parameters['main-balance']);
        this.hideArrow = !!toBoolean(this.item.parameters['hide-arrow']);

        if (this.item.parameters.formula) {
            this.balance = this.dslService.evaluateExpression(this.item.parameters.formula);
        }
    }

    processClick(event: Event, item: MenuContentItem) {
        this.accountMenuService.setActiveItem(item.name);
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Menu);
    }
}
