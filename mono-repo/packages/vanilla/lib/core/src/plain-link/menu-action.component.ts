import { Component, OnInit } from '@angular/core';

import { MenuActionOrigin } from '../menu-actions/menu-actions.models';
import { MenuActionsService } from '../menu-actions/menu-actions.service';
import { DynamicHtmlButtonComponentBase } from './dynamic-html-button-component-base';

/**
 * @whatItDoes Handles behavior of standard `a` link with `href` so it goes through angular `Router`
 *
 * @howToUse
 *
 * If this directive is imported, it will be automatically used for all matching links. Is is also used on links inside
 * of rich text in page matrix components.
 *
 * You can set `data-tracking-event="eventName"` and `data-tracking-data.propertyName="value"` to a sitecore link
 * (or other link that uses `PlainLinkComponent`) and the values will be tracked when the link is clicked.
 *
 * @stable
 */
@Component({
    standalone: true,

    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[menu-action]:not(a[ds-button])',
    template: '<ng-content />',
})
export class MenuActionComponent extends DynamicHtmlButtonComponentBase implements OnInit {
    constructor(private menuActionsService: MenuActionsService) {
        super();
    }

    processClick(event: Event) {
        const element = event.currentTarget as HTMLElement;

        const menuAction = element.getAttribute('menu-action');
        const keyString = element.getAttribute('menu-action-keys');
        const valueString = element.getAttribute('menu-action-values');
        const menuActionsParameters: { [prop: string]: string } = {};

        try {
            if (keyString && valueString) {
                const keys = JSON.parse(keyString);
                const values = JSON.parse(valueString);

                if (!Array.isArray(keys)) {
                    throw new Error('menu-action-keys did not deserialize to an array');
                }

                if (!Array.isArray(values)) {
                    throw new Error('menu-action-values did not deserialize to an array');
                }

                for (let i = 0; i < keys.length; i++) {
                    if (values[i]) {
                        menuActionsParameters[keys[i]] = values[i];
                    }
                }
            }
        } catch (err) {
            this.log.warn(
                `Failed deserializing menu action parameters for menu action. Most likely because of invalid JSON. Keys=${keyString} Values=${valueString}`,
                err,
            );
        }

        event.preventDefault();

        this.menuActionsService.invoke(menuAction!, MenuActionOrigin.Misc, [undefined, undefined, menuActionsParameters]);
    }

    override ngOnInit() {
        super.ngOnInit();

        if (this.elementRef.nativeElement['originalAttributes']) {
            this.elementRef.nativeElement.setAttribute('menu-action', this.elementRef.nativeElement['originalAttributes'].get('menu-action'));
        }
    }
}
