import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ManualOutRightResult } from 'src/app/common/models/manual-outright.module';
import { PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { PaginationService } from 'src/app/common/services/pagination.service';

@Component({
  selector: 'gn-manual-outright',
  templateUrl: './manual-outright.component.html',
  styleUrls: ['./manual-outright.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ManualOutrightComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() result: ManualOutRightResult;
  @Input() pageSize: number;
  @Input() selectionLength: number;
  isInitialised = false;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  mySubscription: Subscription;
  mainClassWrapper: string;

  constructor(private paginationService: PaginationService, private cd: ChangeDetectorRef) {
    this.mySubscription = interval(this.pageRefreshTime).subscribe((x => {
      this.paginationSetup(this.result);
    }));
  }

  ngOnChanges(): void {
    this.paginationService.calculateTotalPages(this.pageDetails, this.result?.Runners.length);
    this.cd.detectChanges();
    if (!this.isInitialised) {
      this.pageDetails.pageSize = this.pageSize;
    }
  }

  ngAfterViewInit(): void {
    this.isInitialised = true;
    this.paginationSetup(this.result);
  }

  paginationSetup(resultContent: ManualOutRightResult) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent?.Runners.length);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.mySubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.checkSelectionsLength(this.result);
  }

  checkSelectionsLength(resultContent: ManualOutRightResult) {
    if (resultContent?.Runners?.length > 0 && resultContent?.Runners?.length <= 6) {
      return this.mainClassWrapper = 'ante-post-small-content';
    }
    else if (resultContent?.Runners?.length > 6 && resultContent?.Runners?.length <= 12) {
      return this.mainClassWrapper = 'ante-post-medium-content';
    }
    else if (resultContent?.Runners?.length > 12 && resultContent?.Runners?.length <= 20) {
      return this.mainClassWrapper = 'ante-post-large-content';
    }
    else if (resultContent?.Runners?.length > 20) {
      return this.mainClassWrapper = 'ante-post-pagination-content';
    }
    else {
      return this.mainClassWrapper = 'ante-post-small-content';
    }
  }

}
