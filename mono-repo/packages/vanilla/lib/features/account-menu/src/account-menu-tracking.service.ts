import { Injectable } from '@angular/core';

import { MenuContentItem, NavigationService, TrackingService } from '@frontend/vanilla/core';
import {
    AccountMenuDataService,
    AccountMenuOnboardingService,
    AccountMenuTasksService,
    DrawerPosition,
    DrawerPositionSettings,
} from '@frontend/vanilla/shared/account-menu';
import { mapValues } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AccountMenuTrackingService {
    get isPageMode(): boolean {
        return !this.accountMenuDataService.routerMode;
    }

    constructor(
        private accountMenuTaskService: AccountMenuTasksService,
        private accountMenuOnboardingService: AccountMenuOnboardingService,
        private accountMenuDataService: AccountMenuDataService,
        private trackingService: TrackingService,
        private navigationService: NavigationService,
    ) {}

    trackOpen(version: number) {
        this.trackingService.triggerEvent('Event.Functionality.MiniMenu', { 'page.referringAction': 'OpeningMiniMenu' });
        if (version >= 3) {
            if (version === 5) {
                this.trackingService.triggerEvent('Event.Tracking', {
                    'component.CategoryEvent': 'my profile',
                    'component.LabelEvent': 'menu',
                    'component.ActionEvent': 'open',
                    'component.PositionEvent': 'not applicable',
                    'component.LocationEvent': 'menu',
                    'component.EventDetails': 'menu',
                    'component.URLClicked': 'not applicable',
                });
            }
            const isCustomerHub = version === 3;
            this.trackingService.triggerEvent('contentView', {
                'component.CategoryEvent': 'my profile',
                'component.LabelEvent': 'menu',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': isCustomerHub ? 'menu drawer' : 'menu',
                'component.EventDetails': isCustomerHub ? 'menu drawer' : 'menu',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    trackClose(version: number) {
        const isEpcot = version === 4;
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': version >= 4 ? 'menu' : 'my profile',
            'component.ActionEvent': 'close',
            'component.PositionEvent': isEpcot && this.accountMenuDataService.routerMode ? this.navigationService.location.path() : 'not applicable',
            'component.LocationEvent': isEpcot && this.accountMenuDataService.routerMode ? this.navigationService.location.path() : 'menu',
            'component.EventDetails': isEpcot ? 'close' : 'cross icon',
            'component.URLClicked': 'not applicable',
        });
    }

    trackDrawer(positionSettings: DrawerPositionSettings) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': positionSettings.isAutomaticallyOpened ? 'my hub' : 'my menu',
            'component.ActionEvent': positionSettings.position !== DrawerPosition.Bottom ? 'open' : 'close',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'menu drawer',
            'component.EventDetails': 'menu drawer',
            'component.URLClicked': 'not applicable',
        });
    }

    trackTaskSwiped() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'close',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my pending tasks tile',
            'component.EventDetails': 'my pending tasks tile',
            'component.URLClicked': 'not applicable',
        });
    }

    trackTaskStack(items: MenuContentItem[]) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my pending tasks tile',
            'component.EventDetails': 'stack of tasks',
            'component.URLClicked': 'not applicable',
        });

        this.trackTasksLoaded(items);
    }

    trackShowAll() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my pending tasks tile',
            'component.EventDetails': 'show all',
            'component.URLClicked': 'not applicable',
        });
    }

    trackTaskClosed(itemName: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'close',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my pending tasks tile',
            'component.EventDetails': itemName,
            'component.URLClicked': 'not applicable',
        });
    }

    trackWidgetsLoad(items: MenuContentItem[]) {
        const data: { [key: string]: string }[] = [];

        items.forEach((item: MenuContentItem) => {
            data.push({
                'component.CategoryEvent': 'my profile',
                'component.LabelEvent': 'my hub',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'my hub page',
                'component.EventDetails': item.text?.toLowerCase(),
            });
        });
        this.trackingService.triggerEvent('Event.OptionLoad', {
            widget: data,
        });
    }

    trackShowMoreClick(expanded: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'my pending tasks',
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': expanded ? 'show more' : 'show less',
            'component.URLClicked': 'not applicable',
        });
    }

    trackOnboardingLoad(currentIndex?: number) {
        const eventName: string = this.getOnboardingStepName(currentIndex);
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': eventName,
            'component.EventDetails': eventName,
            'component.URLClicked': 'not applicable',
        });
    }

    trackStartOnboarding() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': 'onboarding get started screen',
            'component.EventDetails': 'get started cta',
            'component.URLClicked': 'not applicable',
        });
    }

    trackCloseOnboarding(currentIndex?: number) {
        const eventName: string = this.getOnboardingStepName(currentIndex);
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'close',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': eventName,
            'component.EventDetails': eventName,
            'component.URLClicked': 'not applicable',
        });
    }

    trackGotItOnboarding() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': 'onboarding screen 3',
            'component.EventDetails': 'got it cta',
            'component.URLClicked': 'not applicable',
        });
    }

    trackPreviousOnboarding(currentIndex: number) {
        const eventName: string = this.getOnboardingStepName(currentIndex);
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': eventName,
            'component.EventDetails': 'previous',
            'component.URLClicked': 'not applicable',
        });
    }

    trackNextOnboarding(currentIndex: number) {
        const eventName: string = this.getOnboardingStepName(currentIndex);
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': this.isPageMode
                ? 'accountpage'
                : this.accountMenuOnboardingService.isFirstLogin
                  ? 'first login hotspot'
                  : 'next login hotspot',
            'component.LocationEvent': eventName,
            'component.EventDetails': 'next',
            'component.URLClicked': 'not applicable',
        });
    }

    replacePlaceholders(item: MenuContentItem, placeholders: { [key: string]: string }) {
        mapValues(placeholders, (value, key) => {
            if (item.trackEvent) {
                if (item.trackEvent.data && item.trackEvent.data[key]) {
                    item.trackEvent.data[key] = value;
                }
                if (item.trackEvent[`LoadedEvent.${key}`]) {
                    item.trackEvent[`LoadedEvent.${key}`] = value;
                }
                if (item.trackEvent[`ClosedEvent.${key}`]) {
                    item.trackEvent[`ClosedEvent.${key}`] = value;
                }
            }
        });
    }

    trackTasksLoaded(items: MenuContentItem[]) {
        const data: any = [];
        items.forEach((item) => {
            const isUrgent = this.accountMenuTaskService.isUrgent(item);
            data.push({
                'component.CategoryEvent': 'my profile',
                'component.LabelEvent': 'my hub',
                'component.ActionEvent': 'load',
                'component.PositionEvent': isUrgent
                    ? `urgent tasks ${this.accountMenuTaskService.totalUrgentCount}`
                    : `pending tasks ${this.accountMenuTaskService.totalCount - this.accountMenuTaskService.totalUrgentCount}`,
                'component.LocationEvent': 'my pending tasks tile',
                'component.EventDetails': `${(item?.trackEvent && item.trackEvent['LoadedEvent.component.EventDetails']) || ''}${
                    isUrgent ? 'urgent' : 'non urgent'
                }`,
            });
        });
        this.trackingService.triggerEvent('Event.PendingTaskLoad', {
            pending_tasks: data,
        });
    }

    trackTaskOpenProfile() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my balance',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my balance',
            'component.EventDetails': `pending tasks ${this.accountMenuTaskService.totalCount}`,
            'component.URLClicked': 'not applicable',
        });
    }

    trackDarkModeToggle(isEnabled: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'menu',
            'component.ActionEvent': isEnabled ? 'enable' : 'disable',
            'component.PositionEvent': 'account details',
            'component.LocationEvent': 'menu',
            'component.EventDetails': `night mode`,
            'component.URLClicked': 'not applicable',
        });
    }

    trackVerificationStatusLoad(itemName: string) {
        this.trackVerificationStatus('contentView', 'load', itemName);
    }

    trackVerificationStatusClick(itemName: string) {
        this.trackVerificationStatus('Event.Tracking', 'click', itemName);
    }

    trackVerificationStatusTooltipLoad(itemName: string) {
        this.trackVerificationStatus('contentView', 'load', itemName);
    }

    trackLabelSwitcherMenuClicked(destination: string, source: string | undefined, url: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'multi state-switch',
            'component.LabelEvent': 'minimenu multi-state switch',
            'component.ActionEvent': 'switch',
            'component.PositionEvent': `${destination}, ${source}`,
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'state switcher select',
            'component.URLClicked': url,
        });
    }

    private trackVerificationStatus(eventName: string, action: string, eventDetails: string) {
        this.trackingService.triggerEvent(eventName, {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': action,
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'account status badge',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }

    private getOnboardingStepName(currentIndex?: number) {
        let eventName: string;
        if (currentIndex === undefined) {
            eventName = 'onboarding get started screen';
        } else if (currentIndex == 0) {
            eventName = 'onboarding screen 1';
        } else if (currentIndex == 1) {
            eventName = 'onboarding screen 2';
        } else {
            eventName = 'onboarding screen 3';
        }
        return eventName;
    }

    trackSessionStatisticsNavigate() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'customer hub screen',
            'component.EventDetails': 'sesssion statistics',
            'component.URLClicked': 'not applicable',
        });
    }

    async trackSessionStatisticsClick(link: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'customer hub screen',
            'component.EventDetails': link,
            'component.URLClicked': 'not applicable',
        });
    }
}
