import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { MenuActionsService, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { NavigationItem } from './models';
import { NavigationLayoutService } from './navigation-layout.service';

@Component({
    standalone: true,
    imports: [CommonModule, DslPipe],
    selector: 'lh-navigation-layout-left-menu',
    templateUrl: 'navigation-layout-left-menu.component.html',
})
export class NavigationLayoutLeftMenuComponent implements OnInit {
    @Input() sourceItem: string;
    @Input() itemsParent: string;
    item: NavigationItem | null;
    readonly trackByText = trackByProp<MenuContentItem>('text');

    constructor(
        private menuActionsService: MenuActionsService,
        public navigationLayoutService: NavigationLayoutService,
    ) {}

    ngOnInit(): void {
        this.item = this.navigationLayoutService.getItem(this.sourceItem ? this.sourceItem : this.itemsParent);
    }

    processClick(event: Event, item: MenuContentItem) {
        this.menuActionsService.processClick(event, item, 'LeftNavigation');
    }
}
