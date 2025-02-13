import { Directive, Input, OnInit, inject } from '@angular/core';

import { MenuActionsService, MenuContentItem, TimerService, trackByProp } from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';

import { NavigationItem } from './models';
import { NavigationLayoutService } from './navigation-layout.service';

@Directive()
export class NavigationLayoutTopMenuBaseComponent implements OnInit {
    @Input() item: NavigationItem | null;
    readonly trackByText = trackByProp<MenuContentItem>('text');

    private menuActionsService = inject(MenuActionsService);
    private accountMenuService = inject(AccountMenuDataService);
    private navigationLayoutService = inject(NavigationLayoutService);

    get topMenuItems(): MenuContentItem[] {
        return this.accountMenuService.topMenuItems;
    }

    constructor(private timerService: TimerService) {}

    ngOnInit() {
        if (this.navigationLayoutService.isV1orV4) {
            this.navigationLayoutService.showTopMenu.subscribe((s: NavigationItem | null) => this.timerService.setTimeout(() => (this.item = s)));
        }
    }

    processClick(event: Event, item: MenuContentItem) {
        this.menuActionsService.processClick(event, item, 'TopNavigation');
    }
}
