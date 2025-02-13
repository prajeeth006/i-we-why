import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { MenuActionsService, MenuContentItem, TrackingService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, ImageComponent, IconCustomComponent],
    selector: 'vn-help-card',
    templateUrl: 'help-card.html',
})
export class HelpCardComponent implements OnInit {
    @Input() item: MenuContentItem;

    constructor(
        private menuActionsService: MenuActionsService,
        private trackingService: TrackingService,
    ) {}

    ngOnInit() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': 'help & contact section',
            'component.URLClicked': 'not applicable',
        });
    }

    itemClick(event: Event, item: MenuContentItem, origin: string) {
        this.menuActionsService.processClick(event, item, origin);
    }
}
