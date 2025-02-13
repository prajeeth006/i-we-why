import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClientConfigProductName, ContentService, PageViewDataService, ProvidesPageViewData } from '@frontend/vanilla/core';
import { PageMatrixComponent } from '@frontend/vanilla/features/content';
import { SkeletonComponent, SkeletonType } from '@frontend/vanilla/features/skeleton';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

/**
 * @whatItDoes Loads public page content based on url path.
 *
 * @howToUse
 *
 * ```
 * export const routes: Routes = [
 * // ...
 * {
 *     path: '{culture}',
 *     children: [
 *         // ...
 *         {
 *             path: 'p',
 *             children: [
 *                 {
 *                     path: '**',
 *                     component: PublicPageLoaderComponent,
 *                     data: {
 *                         publicPageRoot: 'Playground-v1.0/PublicPages/'
 *                     }
 *                 }
 *             ]
 *         },
 *         // ...
 *     ]
 * }
 * // ...
 * ]
 * ```
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, PageMatrixComponent, SkeletonComponent],
    selector: 'vn-public-page-loader',
    template: `
        @if (content) {
            <vn-page-matrix [content]="content | dsl | async" />
        }
        @if (!content && this.path?.indexOf('safer-gambling') > -1) {
            <vn-skeleton [type]="SkeletonType.PublicPages" />
        }
    `,
})
@ProvidesPageViewData()
export class PublicPageLoaderComponent implements OnInit, OnDestroy {
    content: any;
    path: string;

    SkeletonType = SkeletonType;

    private unsubscribe = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private contentService: ContentService,
        private pageViewDataService: PageViewDataService,
    ) {}

    ngOnInit() {
        this.activatedRoute.url.pipe(takeUntil(this.unsubscribe)).subscribe((url) => {
            let isNotFound = false;
            this.path = url.join('/');
            this.contentService
                .getJson(this.activatedRoute.snapshot.data['publicPageRoot'] + this.path, {
                    filterOnClient: true,
                    product: this.activatedRoute.snapshot.data['product'],
                })
                .pipe(
                    catchError(() => {
                        isNotFound = true;
                        return this.contentService.getJson('App-v1.0/partials/notfound', {
                            product: ClientConfigProductName.SF,
                            filterOnClient: true,
                        });
                    }),
                )
                .subscribe((data) => {
                    this.content = data;

                    if (isNotFound) {
                        this.pageViewDataService.setDataForNavigation(this.activatedRoute.snapshot, {
                            'page.name': 'Errorpage - Not Found',
                        });
                    } else {
                        this.pageViewDataService.setDataForNavigation(this.activatedRoute.snapshot, {});
                    }
                });
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
