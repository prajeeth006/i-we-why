import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/**
 * @stable
 */
export enum SkeletonType {
    AccountMenuWidget = 'account-menu-widget',
    PublicPages = 'public-pages',
}

/**
 * @stable
 */
@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vn-account-menu-widget-skeleton',

    template: `
        <div class="ch ch-shade ch-widget dh ch__font p-3 mb-2">
            <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center w-100">
                    <span class="mr-2 ch-widget__icon--skeleton d-inline-block"></span>
                    <span class="ch-widget--skeleton ch-widget--skeleton--sm"></span>
                </div>
            </div>
            <div class="divider"></div>
            <div class="ch-widget--skeleton"></div>
        </div>
    `,
})
export class AccountMenuWidgetSkeletonComponent {}

/**
 * @stable
 */
@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vn-public-pages-skeleton',
    template: `
        <div class="bg-home-skeleton sk-safer-gambling-container">
            <div class="sk-banner">
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
            </div>
            <div class="sk-safer-gambling-box">
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
            </div>
            <div class="sk-safer-gambling-box">
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
                <div class="sk-title"></div>
            </div>
        </div>
    `,
})
export class PublicPagesSkeletonComponent {}

/**
 * @stable
 */
@Component({
    imports: [AccountMenuWidgetSkeletonComponent, PublicPagesSkeletonComponent],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vn-skeleton',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/skeleton/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
        @switch (type()) {
            @case (SkeletonType.AccountMenuWidget) {
                <vn-account-menu-widget-skeleton />
            }
            @case (SkeletonType.PublicPages) {
                <vn-public-pages-skeleton />
            }
        }
    `,
})
export class SkeletonComponent {
    type = input<SkeletonType>();

    SkeletonType = SkeletonType;
}
