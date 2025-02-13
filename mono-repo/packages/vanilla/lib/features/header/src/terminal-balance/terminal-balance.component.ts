import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CurrencyPipe, DslService, ElementKeyDirective, SessionStoreKey, SessionStoreService, toBoolean } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { Observable, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, ElementKeyDirective, CurrencyPipe],
    selector: 'vn-h-terminal-balance',
    templateUrl: 'terminal-balance.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/avatar-v2/terminal-balance/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TerminalBalanceComponent extends HeaderItemBase implements OnInit {
    balance: Observable<number>;
    isBalanceVisible: boolean;
    showVisibilityToggle: boolean;

    private balanceRefreshSubject = new Subject();

    constructor(
        private balancePropertiesService: BalancePropertiesService,
        private dslService: DslService,
        private sessionStoreService: SessionStoreService,
    ) {
        super();
    }

    ngOnInit() {
        const isBalanceVisible = this.sessionStoreService.get<boolean>(SessionStoreKey.IsBalanceVisible);
        this.isBalanceVisible = isBalanceVisible === null ? !!toBoolean(this.item.parameters['balance-visible']) : isBalanceVisible;
        this.showVisibilityToggle = !!toBoolean(this.item.parameters['visibility-toggle']);

        const balanceDsl = this.item.parameters['balance'];

        if (balanceDsl) {
            this.balance = this.dslService.evaluateExpression(balanceDsl);
        }

        if (this.showVisibilityToggle) {
            this.sessionStoreService.set(SessionStoreKey.IsBalanceVisible, this.isBalanceVisible);

            this.balanceRefreshSubject
                .pipe(throttleTime(Number(this.item.parameters['balance-refresh-timeout'])))
                .subscribe(() => this.balancePropertiesService.refresh());
        }
    }

    override processClick() {
        if (!this.showVisibilityToggle) {
            return;
        }

        this.isBalanceVisible = !this.sessionStoreService.get<boolean>(SessionStoreKey.IsBalanceVisible);
        this.sessionStoreService.set(SessionStoreKey.IsBalanceVisible, this.isBalanceVisible);

        if (this.isBalanceVisible) {
            this.balanceRefreshSubject.next(null);
        }
    }
}
