import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import {
    DslService,
    DynamicLayoutService,
    DynamicLayoutSlotComponent,
    HtmlNode,
    MenuContentItem,
    MenuContentSection,
    Page,
    SingleSlot,
    SlotName,
    SlotType,
    trackByProp,
} from '@frontend/vanilla/core';
import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { LabelSwitcherComponent } from '@frontend/vanilla/features/label-switcher';
import { ResponsiveLanguageSwitcherComponent } from '@frontend/vanilla/features/language-switcher';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';

import { FooterMenuItemComponent } from './footer-menu-item.component';
import { FooterMenuSectionComponent } from './footer-menu-section.component';
import { ResponsiveFooterContent } from './footer.client-config';
import { HelpButtonComponent } from './sub-components/help-button.component';

/** @stable */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        DslPipe,
        ContentMessagesComponent,
        LabelSwitcherComponent,
        ResponsiveLanguageSwitcherComponent,
        DynamicLayoutSlotComponent,
        OverlayModule,
        HelpButtonComponent,
        FooterMenuSectionComponent,
        FooterMenuItemComponent,
    ],
    selector: 'vn-footer',
    templateUrl: 'footer.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/footer/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnInit, OnDestroy {
    footerSlot: SingleSlot;
    logoSections: MenuContentSection[] = [];
    showResponsiveLanguageSwitcher: boolean;
    configReady: boolean = false;

    SlotName = SlotName;

    helpButton: MenuContentItem | undefined;
    readonly trackByText = trackByProp<MenuContentItem>('text');
    readonly trackByName = trackByProp<MenuContentItem>('name');
    readonly trackBySectionName = trackByProp<MenuContentSection>('name');

    private unsubscribe = new Subject<void>();

    constructor(
        public config: ResponsiveFooterContent,
        private htmlNode: HtmlNode,
        private page: Page,
        private dslService: DslService,
        private dynamicLayoutService: DynamicLayoutService,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.config.whenReady);
        this.configReady = true;

        this.footerSlot = this.dynamicLayoutService.getSlot<SingleSlot>(SlotName.Footer, SlotType.Single);

        this.showResponsiveLanguageSwitcher = this.page.uiLanguages.length > 1;

        if (this.config.showHelpButton) {
            this.dslService
                .evaluateContent(this.config.helpButton)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((item: MenuContentItem) => {
                    if (item?.name) {
                        this.helpButton = item;
                    }
                });
        }

        if (this.showResponsiveLanguageSwitcher) {
            this.dslService.evaluateExpression<boolean>(this.config.showLanguageSwitcherDslCondition).subscribe((isEnabled: boolean) => {
                this.showResponsiveLanguageSwitcher = isEnabled;

                if (this.showResponsiveLanguageSwitcher) {
                    this.setContactHtmlClass(false);
                    this.setLanguageSwitcherHtmlClass(true);
                } else if (this.config.showHelpButton) {
                    this.setContactHtmlClass(true);
                    this.setLanguageSwitcherHtmlClass(false);
                }
            });
        } else if (this.config.showHelpButton) {
            this.setContactHtmlClass(true);
        }

        if (this.config.logos.left) {
            this.logoSections.push(this.config.logos.left);
        }

        if (this.config.logos.right) {
            this.logoSections.push(this.config.logos.right);
        }
    }

    ngOnDestroy() {
        this.setContactHtmlClass(false);
        this.setLanguageSwitcherHtmlClass(false);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private setContactHtmlClass(add: boolean) {
        this.htmlNode.setCssClass('footer_items-help-contact-shown', add);
    }

    private setLanguageSwitcherHtmlClass(add: boolean) {
        this.htmlNode.setCssClass('language-switcher-shown', add);
    }
}
