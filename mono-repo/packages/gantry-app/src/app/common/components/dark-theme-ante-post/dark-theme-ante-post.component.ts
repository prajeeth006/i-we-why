import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { AntePostResult } from '../../models/ante-post.model';
import { PaginationContent } from '../../models/pagination/pagination.models';
import { PaginationService } from '../../services/pagination.service';

@Component({
    selector: 'gn-dark-theme-ante-post',
    templateUrl: './dark-theme-ante-post.component.html',
    styleUrls: ['./dark-theme-ante-post.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeAntePostComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() result: AntePostResult;
    @Input() pageSize: number;
    @Input() selectionLength: number;
    isInitialised = false;
    pageRefreshTime = 30000;
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
        this.paginationService.calculateTotalPages(this.pageDetails, this.result?.selections?.length);
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
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.selections?.length);
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }

    getSelectionNumberClass(selectionsLength: number): string {
        if (selectionsLength > 16) {
            return 'col-2 selection-number-20';
        } else if (selectionsLength > 12) {
            return 'col-2 selection-number-16';
        } else if (selectionsLength > 8) {
            return 'col-2 selection-number-12';
        } else if (selectionsLength > 6) {
            return 'selection-number-8';
        }
        return 'selection-number-6';
    }
}
