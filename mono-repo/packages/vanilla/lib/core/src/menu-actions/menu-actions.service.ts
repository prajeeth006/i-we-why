import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { delay, first, map } from 'rxjs/operators';

import { MenuContentItem } from '../content/content.models';
import { DslService } from '../dsl/dsl.service';
import { GenericActionsService } from '../generic-actions/generic-actions.service';
import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { NavigationService } from '../navigation/navigation.service';
import { TrackingService } from '../tracking/tracking-core.service';
import { WebAnalyticsEventType } from '../tracking/tracking-provider';
import { MenuActionHandler, MenuActionItem } from './menu-actions.models';

/**
 * @whatItDoes Allows applications to register menu actions from outside of vanilla
 *
 * @howToUse
 *
 * ```
 * // at application bootstrap
 * menuActionsService.register('gotoCashier', function(origin) {
 *     // build cashier url
 *
 *     return cashierUrl;
 * });
 * ```
 *
 * @description
 *
 * Applications that use vanilla framework can register or override actions, that are executed
 * by menu actions from components that are in the layout (like header, menu, footer). The method
 * name to execute either comes from sitecore (i.e. `openInNewWindow`, `gotoCashier`) or a static name
 * (i.e. `logout`, `gotoCashier`).
 *
 * Vanilla provides following methods:
 *  - `openInNewWindow`
 *  - `logout`
 *  - `toggleMainMenu`
 *
 * The registered method gets passed following arguments:
 *  - `origin` - a string describing where the menu action was originated (e.g. Menu, Header)
 *  - arbitrary args passed to `invoke` as an array (destructed)
 *
 * And can return:
 *  - nothing - no action
 *  - string - url to redirect to
 *  - promise - for async actions (e.g. logout) the `invoke` method also return the promise
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MenuActionsService {
    private static readonly ActionPrefix: string = 'menu-action:';
    private navigationSubject = new Subject<string>();

    constructor(
        navigationService: NavigationService,
        private genericActionsService: GenericActionsService,
        private nativeAppService: NativeAppService,
        private dslService: DslService,
        private trackingService: TrackingService,
    ) {
        this.navigationSubject.pipe(map((href: string) => navigationService.goTo(href))).subscribe();
    }

    register(name: string, fn: MenuActionHandler) {
        this.genericActionsService.register(MenuActionsService.ActionPrefix + name, fn);
    }

    async processClick(event: Event, item: MenuActionItem, origin: string, shouldTrack: boolean = true) {
        this.trackClick(item, shouldTrack);

        if (
            !item.clickAction &&
            (item.target ||
                (<KeyboardEvent>event).ctrlKey ||
                (<KeyboardEvent>event).metaKey ||
                (<KeyboardEvent>event).shiftKey ||
                (<KeyboardEvent>event).altKey)
        ) {
            return;
        }

        event.preventDefault();

        const parameters = item.parameters || {};
        const ccbNavigation = parameters['ccb-navigation'];

        this.dslService
            .evaluateExpression(ccbNavigation || 'false')
            .pipe(first(), delay(0))
            .subscribe((r) => {
                if (r && this.nativeAppService.isNative) {
                    const ccbEventName = parameters['ccb-event-name'];
                    this.nativeAppService.sendToNative({
                        eventName: ccbEventName ?? NativeEventType.MENU_ITEM_NAVIGATION,
                        parameters: { url: item.url, name: item.name, section: origin },
                    });
                } else {
                    this.invoke(item.clickAction, origin, [item.url, item.target, item.parameters || {}]);
                }
            });
    }

    invoke(fname: string | undefined, origin: string, args?: any[]): Promise<void> {
        args = args || [];
        let url;

        if (fname && this.genericActionsService.isRegistered(MenuActionsService.ActionPrefix + fname)) {
            const result = this.genericActionsService.invoke(MenuActionsService.ActionPrefix + fname, [origin].concat(args));

            if (typeof result === 'string') {
                url = result;
            } else if (result && result.then) {
                return result;
            } else {
                return Promise.resolve();
            }
        }

        url = url || args[0];

        if (url && typeof url == 'string') {
            this.navigationSubject.next(url);
        }

        return Promise.resolve();
    }

    async trackClick(item: MenuActionItem, shouldTrack: boolean = true) {
        if (shouldTrack) {
            if (item.trackEvent) {
                item.trackEvent.data = item.trackEvent.data || {};

                if (item.trackEvent.data['component.URLClicked'] === 'link') {
                    item.trackEvent.data['component.URLClicked'] = item.url;
                }

                if (item.trackEvent.await) {
                    await this.trackingService.triggerEvent(item.trackEvent.eventName, item.trackEvent.data);
                } else {
                    this.trackingService.triggerEvent(item.trackEvent.eventName, item.trackEvent.data);
                }
            } else {
                await this.trackingService.trackEvents(item as MenuContentItem, WebAnalyticsEventType.click);
            }
        }
    }
}
