import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LanguageInfo, MetaTagsService, NavigationService, Page, PageViewDataService, ProvidesPageViewData, WINDOW } from '@frontend/vanilla/core';
import { PageMatrixComponent } from '@frontend/vanilla/features/content';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [PageMatrixComponent],
    selector: 'vn-not-found',
    templateUrl: 'not-found.html',
})
@ProvidesPageViewData()
export class NotFoundComponent implements OnInit {
    readonly showNotFoundPage = signal<boolean>(false);

    readonly #window = inject(WINDOW);

    constructor(
        private page: Page,
        private navigationService: NavigationService,
        private metaTagsService: MetaTagsService,
        private pageViewDataService: PageViewDataService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        const lang = this.navigationService.location.culture;

        // if language in the url doesn't match the page language, do a force reload
        // example: there is a link to /de/ on english page for some reason, and that route is not available (because it's not registered)
        //  this will reload the page to try to load the german variant of the page
        if (lang !== this.page.lang && this.page.uiLanguages.some((language: LanguageInfo) => language.routeValue === lang)) {
            this.pageViewDataService.setDataForNavigation(this.activatedRoute.snapshot, {});
            this.#window.location.reload();
        } else {
            this.metaTagsService.whenReady.subscribe(() => this.metaTagsService.setPageTags(undefined, { 'prerender-status-code': '404' }));
            this.showNotFoundPage.set(true);
            this.pageViewDataService.setDataForNavigation(this.activatedRoute.snapshot, {
                'page.name': 'Errorpage - Not Found',
            });
        }
    }
}
