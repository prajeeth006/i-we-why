import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject, input } from '@angular/core';

import { NavigationService, TrackingService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';

import { SmartBannerResourceService } from './smart-banner-resource.service';
import { SmartBannerStarsComponent } from './smart-banner-stars.component';
import { SmartBannerData } from './smart-banner.models';

@Component({
    standalone: true,
    imports: [CommonModule, SmartBannerStarsComponent, IconCustomComponent],
    selector: 'vn-smart-banner',
    templateUrl: 'smart-banner.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/smart-banner/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartBannerComponent implements OnInit {
    private smartBannerResourceService = inject(SmartBannerResourceService);
    private navigationService = inject(NavigationService);
    private trackingService = inject(TrackingService);
    closeIcon: string;

    smartBanner = input.required<SmartBannerData>();

    ngOnInit() {
        this.trackBanner('load', 'open app prompt banner');
        this.closeIcon = this.smartBanner().content.messages?.CloseIcon || 'theme-ex';
    }

    close() {
        this.smartBannerResourceService.close();
        this.trackBanner('click', 'close cta');
    }

    open(url?: string) {
        if (url) {
            this.close();
            this.trackBanner('click', 'open cta');
            this.navigationService.goTo(url);
        }
    }

    private trackBanner(action: string, eventDetails: string) {
        this.trackingService.triggerEvent(action === 'load' ? 'contentView' : 'Event.Tracking', {
            'component.CategoryEvent': 'banners',
            'component.LabelEvent': 'app banners',
            'component.ActionEvent': action,
            'component.PositionEvent': 'top of the page',
            'component.LocationEvent': 'open app prompt banner',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
}
