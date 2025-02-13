import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

import { MenuContentItem, MenuSection, Page, TrackingService, UtilsService, trackByProp } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { AccountMenuDataService, AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-common-actions-card',
    templateUrl: 'common-actions-card.html',
})
export class CommonActionsCardComponent implements OnInit {
    @Input() item: MenuContentItem;

    accountMenuDataService = inject(AccountMenuDataService);
    MenuSection = MenuSection;
    readonly trackByText = trackByProp<MenuContentItem>('text');
    private accountMenuTasksService = inject(AccountMenuTasksService);
    private trackingService = inject(TrackingService);
    private pageConfig = inject(Page);
    get useFastIconType(): boolean {
        return this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'navigation-layout')
            : false;
    }
    ngOnInit() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': `pending tasks ${this.accountMenuTasksService.totalCount} - urgent tasks ${this.accountMenuTasksService.totalUrgentCount}`,
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': 'my common actions section',
            'component.URLClicked': 'not applicable',
        });
    }
}
