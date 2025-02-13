import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { PaginationService } from '../../../../common/services/pagination.service';
import { OutRightCdsContent } from '../../models/outright-cds.model';

@Component({
    selector: 'gn-outright-market',
    templateUrl: './outright-market.component.html',
    styleUrls: ['./outright-market.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class OutrightMarketComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
    @Input() selectionLength: number;
    @Input() pageSize: number;
    @Input() result: OutRightCdsContent;
    pageDetails: PaginationContent = new PaginationContent();
    isInitialised = false;
    pageRefreshTime = 20000;
    mySubscription: Subscription;
    mainClassWrapper: string;

    constructor(
        private paginationService: PaginationService,
        private cd: ChangeDetectorRef,
    ) {
        this.mySubscription = interval(this.pageRefreshTime).subscribe(() => {
            this.paginationSetup(this.result);
        });
    }

    ngOnChanges(): void {
        this.paginationService.calculateTotalPages(this.pageDetails, this.result?.finalResult?.selections?.length);
        this.cd.detectChanges();
        if (!this.isInitialised) {
            this.pageDetails.pageSize = this.pageSize;
        }
    }

    ngAfterViewInit(): void {
        this.isInitialised = true;
        this.paginationSetup(this.result);
    }

    paginationSetup(resultContent: OutRightCdsContent) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.finalResult?.selections?.length);
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }
    ngOnInit(): void {
        this.checkSelectionsLength(this.result);
    }

    checkSelectionsLength(resultContent: OutRightCdsContent) {
        if (resultContent?.finalResult?.selections?.length > 0 && resultContent?.finalResult?.selections?.length <= 6) {
            return (this.mainClassWrapper = 'ante-post-small-content');
        } else if (resultContent?.finalResult?.selections?.length > 6 && resultContent?.finalResult?.selections?.length <= 12) {
            return (this.mainClassWrapper = 'ante-post-medium-content');
        } else if (resultContent?.finalResult?.selections?.length > 12 && resultContent?.finalResult?.selections?.length <= 20) {
            return (this.mainClassWrapper = 'ante-post-large-content');
        } else if (resultContent?.finalResult?.selections?.length > 20) {
            return (this.mainClassWrapper = 'ante-post-pagination-content');
        } else {
            return (this.mainClassWrapper = 'ante-post-small-content');
        }
    }
}
