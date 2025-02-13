import { AfterViewInit, Component, Input, OnChanges, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AntePostResult } from 'src/app/common/models/ante-post.model';
import { PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { PaginationService } from 'src/app/common/services/pagination.service';

@Component({
  selector: 'gn-ante-post-large',
  templateUrl: './ante-post-large.component.html',
  styleUrls: ['./ante-post-large.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AntePostLargeComponent  implements AfterViewInit, OnDestroy, OnChanges {

  @Input() result: AntePostResult;
  @Input() pageSize: number;
  @Input() selectionLength: number;
  isInitialised = false;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  mySubscription: Subscription;

  constructor(private paginationService: PaginationService, private cd: ChangeDetectorRef) {
    this.mySubscription = interval(this.pageRefreshTime).subscribe((x => {
      this.paginationSetup(this.result);
    }));
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
}