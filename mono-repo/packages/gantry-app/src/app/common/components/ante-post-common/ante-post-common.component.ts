import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { AntePostResult } from '../../models/ante-post.model';
import { PaginationContent } from '../../models/pagination/pagination.models';
import { PaginationService } from '../../services/pagination.service';

@Component({
    selector: 'gn-ante-post-common',
    templateUrl: './ante-post-common.component.html',
    styleUrl: './ante-post-common.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class AntePostCommonComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() result: AntePostResult;
    @Input() pageSize: number;
    @Input() selectionLength: number;
    isInitialised = false;
    pageRefreshTime = 20000;
    pageDetails: PaginationContent = new PaginationContent();
    mySubscription: Subscription;

    constructor(
        private paginationService: PaginationService,
        private cd: ChangeDetectorRef,
    ) {
        this.mySubscription = interval(this.pageRefreshTime).subscribe(() => {
            this.paginationSetup(this.result);
        });
    }

    ngOnChanges(): void {
        this.paginationService.calculateTotalPages(this.pageDetails, this.result?.selections.length);
        this.cd.detectChanges();
        if (!this.isInitialised) {
            this.pageDetails.pageSize = this.pageSize;
        }
    }

    ngAfterViewInit(): void {
        this.isInitialised = true;
        this.paginationSetup(this.result);
    }

    paginationSetup(resultContent: AntePostResult) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.selections.length);
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }

    getSelectionNumberClass(selectionsLength: number): string {
        if (selectionsLength > 20) {
            return 'ante-post-pagination-content';
        } else if (selectionsLength > 12 && selectionsLength <= 20) {
            return 'ante-post-large-content';
        } else if (selectionsLength > 6 && selectionsLength <= 12) {
            return 'ante-post-medium-content';
        } else if (selectionsLength > 0 && selectionsLength <= 6) {
            return 'ante-post-small-content';
        }
        return 'ante-post-small-content';
    }
}
