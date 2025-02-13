import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

import { CookieName, CookieService, ElementKeyDirective, UserEvent, UserLogoutEvent, UserService } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { NgxFloatUiDirective, NgxFloatUiPlacements } from 'ngx-float-ui';
import { filter } from 'rxjs';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, ElementKeyDirective, MenuItemComponent, NgxFloatUiDirective, PopperContentComponent],
    selector: 'vn-h-deposit-button',
    templateUrl: 'deposit-button.html',
})
export class DepositButtonComponent extends HeaderItemBase implements OnInit {
    readonly FloatUiPlacement = NgxFloatUiPlacements;
    readonly isTooltipEnabled = signal<boolean>(false);

    constructor(
        private cookieService: CookieService,
        private userService: UserService,
    ) {
        super();

        this.userService.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(() => {
            this.cookieService.remove(CookieName.DepositTooltipDismissed);
        });
    }

    ngOnInit() {
        this.isTooltipEnabled.set(
            !!this.item.toolTip &&
                !!this.cookieService.get(CookieName.DepositTooltip) &&
                !this.cookieService.get(CookieName.DepositTooltipDismissed) &&
                !this.userService.realPlayer,
        );
    }

    onTooltipClose() {
        this.cookieService.put(CookieName.DepositTooltipDismissed, '1');
    }
}
