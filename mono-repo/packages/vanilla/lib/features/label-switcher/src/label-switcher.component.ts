import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { HtmlNode, trackByProp } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { LabelSwitcherTrackingService } from './label-switcher-tracking.service';
import { LabelSwitcherConfig } from './label-switcher.client-config';
import { LabelSwitcherItem } from './label-switcher.models';
import { LabelSwitcherService } from './label-switcher.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, OverlayModule, IconCustomComponent],
    selector: 'vn-label-switcher',
    templateUrl: 'label-switcher.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/label-switcher/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LabelSwitcherComponent implements OnInit {
    showLabels: boolean;

    @Input() hideFlag: boolean;

    readonly trackByName = trackByProp<LabelSwitcherItem>('name');

    constructor(
        public labelSwitcherService: LabelSwitcherService,
        public labelSwitcherConfig: LabelSwitcherConfig,
        private trackingService: LabelSwitcherTrackingService,
        private htmlNode: HtmlNode,
    ) {}

    ngOnInit() {
        if (this.labelSwitcherService.items.length) {
            this.htmlNode.setCssClass('label-switcher-shown', true);
        }
    }

    toggle() {
        this.showLabels = !this.showLabels;

        if (this.showLabels) {
            const positionEvent = this.labelSwitcherService.currentGeoLocationItem?.text;
            this.trackingService.trackDropDown('Click', positionEvent || '', 'Footer State Switcher');
        }
    }

    async switchLabel(item: LabelSwitcherItem) {
        if (item.isActive) {
            return;
        }

        this.trackingService.trackDropDown(
            'Switch',
            `${this.labelSwitcherService.currentGeoLocationItem?.text}, ${this.labelSwitcherService.currentLabelItem?.text}`,
            item.text,
            item.url,
        );

        this.showLabels = false;
        await this.labelSwitcherService.switchLabel(item);
    }
}
