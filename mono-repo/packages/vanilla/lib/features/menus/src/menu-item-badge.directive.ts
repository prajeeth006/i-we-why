import { Directive, HostBinding, Input, OnInit } from '@angular/core';

import { MenuItemCounter, MenuItemsService } from '@frontend/vanilla/core';
import { BadgeConfig } from '@frontend/vanilla/shared/badge';

/**
 * @stable
 */
export enum BadgeType {
    Counter = 'counter',
    Icon = 'icon',
}

/**
 * @whatItDoes Displays a counter or icon for specified item.
 *
 * @howToUse
 *
 * ```
 * <span vnMenuItemBadge section="Header" item="inbox" badgeClass="badge-danger" badgeType="counter"></span>
 * ```
 *
 * @description
 *
 * {@link BadgeType.Counter} is displayed based on the value set by {@link MenuItemsService}.
 * {@link BadgeType.Icon} is displayed based on a class configured in {@link https://admin.dynacon.prod.env.works/services/198137/features/159289/keys/159291/valuematrix?_matchAncestors=true|DynaCon}.
 *
 * `badgeType` and `badgeClass` can also be set dynamically from {@link MenuItemsService.setCounter()}.
 *
 * @param section string to indicate in which feature the badge is part of: e.g. {@link MenuSection.Header}.
 * @param item string to indicate the badge name.
 * @param badgeClass string | array to indicate classes applied to the badge element. Default classes for {@link BadgeType.Counter}: `['badge', 'badge-circle', 'badge-t-r']`.
 * @param badgeType string | undefined to indicate the badge type: e.g. {@link BadgeType.Icon}; {@link BadgeType.Counter} by default. If `badgeType` is provided, badge will be always visible.
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: 'span[vnMenuItemBadge]',
})
export class MenuItemBadgeDirective implements OnInit {
    @Input() section: string;
    @Input() item: string;
    @Input() badgeClass?: string | string[];
    @Input() badgeType?: string;

    private counter: MenuItemCounter | null;

    @HostBinding() get class(): string {
        // Default classes
        const classList = ['badge', 'badge-circle', 'badge-t-r'];

        // Classes set in the element input
        if (Array.isArray(this.badgeClass)) {
            classList.push(...this.badgeClass);
        } else if (this.badgeClass) {
            if (this.badgeClass.indexOf(' ') > 0) {
                classList.push(...this.badgeClass.split(' '));
            } else {
                classList.push(this.badgeClass);
            }
        }

        /** Classes set by {@link MenuItemsService.setCounter} */
        if (this.counter?.cssClass) {
            if (this.counter.cssClass.indexOf(' ') > 0) {
                classList.push(...this.counter.cssClass.split(' '));
            } else {
                classList.push(this.counter.cssClass);
            }
        }

        /** Classes configured in {@link https://admin.dynacon.prod.env.works/services/198137/features/159289/keys/159291/valuematrix?_matchAncestors=true} */
        if (this.badgeConfig.cssClass) {
            if (this.badgeConfig.cssClass.indexOf(' ') > 0) {
                classList.push(...this.badgeConfig.cssClass.split(' '));
            } else {
                classList.push(this.badgeConfig.cssClass);
            }
        }

        return classList.join(' ');
    }

    @HostBinding('textContent') get text() {
        const badgeType = this.counter?.type || this.badgeType || BadgeType.Counter;

        return badgeType === BadgeType.Counter ? this.counter?.count || '' : '';
    }

    @HostBinding() get hidden(): boolean {
        const badgeType = this.counter?.type || this.badgeType || BadgeType.Counter;

        switch (badgeType) {
            case BadgeType.Icon:
                return !this.counter?.cssClass;
            case BadgeType.Counter:
                return !this.counter?.count;
            default:
                return !this.counter?.count;
        }
    }

    constructor(
        private menuItemsService: MenuItemsService,
        private badgeConfig: BadgeConfig,
    ) {}

    ngOnInit() {
        this.counter = this.menuItemsService.getCounter(this.section, this.item);
    }
}
