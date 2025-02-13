import { AsyncPipe, CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation, inject } from '@angular/core';

import {
    DynamicLayoutSlotComponent,
    ElementKeyDirective,
    MenuActionOrigin,
    MenuActionsService,
    MenuSection,
    ObserveSizeDirective,
    SlotName,
    UserService,
    VanillaElements,
} from '@frontend/vanilla/core';
import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AuthstateDirective } from '@frontend/vanilla/shared/auth';
import { Observable, Subject, first } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';

import { HeaderMessagesService } from './header-messages.service';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { HeaderConfig } from './header.client-config';
import { HeaderService } from './header.service';
import { NavigationPillService } from './navigation-pill/navigation-pill.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        ContentMessagesComponent,
        ElementKeyDirective,
        HeaderSectionComponent,
        DynamicLayoutSlotComponent,
        AuthstateDirective,
        AsyncPipe,
        ObserveSizeDirective,
        IconCustomComponent,
    ],
    selector: 'vn-header',
    templateUrl: 'header.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/header/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
    user = inject(UserService);
    headerConfig = inject(HeaderConfig);
    headerService = inject(HeaderService);
    headerMessagesService = inject(HeaderMessagesService);
    navigationPillService = inject(NavigationPillService);

    MenuSection = MenuSection;
    SlotName = SlotName;
    VanillaElements = VanillaElements;

    config: Observable<HeaderConfig> = this.headerConfig.whenReady.pipe(
        map(() => this.headerConfig),
        shareReplay(1),
    );

    private menuActionsService = inject(MenuActionsService);
    private renderer2 = inject(Renderer2);
    private listener: () => void;
    private destroyed = new Subject<void>();
    private readonly _doc = inject(DOCUMENT);

    ngOnInit() {
        this.config
            .pipe(
                first(),
                filter((config: HeaderConfig) => config.enableToggleOnScroll),
                takeUntil(this.destroyed),
            )
            .subscribe(() => {
                this.listener = this.renderer2.listen('document', 'scroll', () => {
                    const elementScrolled = this._doc.getElementsByTagName('vn-main')[0];
                    const maxScrollDistanceToBreak = 30;

                    if (elementScrolled) {
                        const elementsToHide = this._doc.querySelectorAll('[toggle-scroll="one"]');
                        const mainContentTop = elementScrolled.getBoundingClientRect().top;
                        const elementLoggedInCounter = this._doc.getElementsByTagName('vn-h-login-start-time')[0];
                        const headerTopItems = this._doc.querySelectorAll('[toggle-scroll="all"]')[0];

                        if (elementsToHide.length > 0) {
                            const mainTopPosition = Math.round(mainContentTop);

                            for (let i = 0; i < elementsToHide.length; i++) {
                                mainTopPosition < maxScrollDistanceToBreak
                                    ? elementsToHide[i]?.classList.add('scrolled')
                                    : elementsToHide[i]?.classList.remove('scrolled');
                            }

                            if (elementLoggedInCounter) {
                                mainTopPosition < maxScrollDistanceToBreak
                                    ? elementLoggedInCounter.classList.add('hide-all')
                                    : elementLoggedInCounter.classList.remove('hide-all');
                            }

                            if (headerTopItems) {
                                mainTopPosition < maxScrollDistanceToBreak
                                    ? headerTopItems.classList.add('hide-all')
                                    : headerTopItems.classList.remove('hide-all');
                            }
                        }
                    }
                });
            });
    }

    ngOnDestroy() {
        if (this.listener) {
            this.listener();
        }

        this.destroyed.next();
        this.destroyed.complete();
    }

    processClick(event: Event, item: any) {
        this.menuActionsService.processClick(event, item, MenuActionOrigin.Header);
    }
}
