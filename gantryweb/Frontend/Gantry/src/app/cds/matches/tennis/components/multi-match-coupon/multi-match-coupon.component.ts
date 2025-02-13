import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { Observable, Subscription, interval } from 'rxjs';
import { HomeAwayData } from '../../models/multi-match-model';
import { PaginationContent, PageSizes } from 'src/app/common/models/pagination/pagination.models';
import { TennisCdsService } from '../../services/tennis-cds.service';
import { MultiMatchCouponService } from './services/multi-match-coupon.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';


@Component({
  selector: 'gn-multi-match-coupon',
  templateUrl: './multi-match-coupon.component.html',
  styleUrls: ['./multi-match-coupon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MultiMatchCouponComponent implements OnInit {
  nameLength = SelectionNameLength.Seventeen;
  updatedFixture: FixtureView;
  eventMarketPairs: any;
  homeAndAwayResult: HomeAwayData = new HomeAwayData();
  paginatedResult: any;
  pageDetails: PaginationContent = new PaginationContent();
  pageTimerSubscription: Subscription;
  pageRefreshTime = 20000;
  errorMessage$ = this.TennisCdsService.errorMessage$;
  multiMatchCouponCdsContent$: Observable<HomeAwayData>;
  isPageIntialised = false;


  constructor(routeDataService: RouteDataService,
    private TennisCdsService: TennisCdsService,
    private multiMatchCouponService: MultiMatchCouponService,
    private cdsPushProvider: CdsPushProvider,
    private paginationService: PaginationService,
    private cdsClientService: CdsClientService
  ) {
    let queryParams = routeDataService?.getQueryParams();
    this.eventMarketPairs = queryParams['eventMarketPairs'];
    this.pageDetails.pageSize = PageSizes.Nine;
  }


  getFixtureAndGameIds() {
    let fixtureIds: string[] = [];
    let gameIds: string[] = [];
    const splitPairs = this.eventMarketPairs?.split(',');

    splitPairs?.forEach((marketPair: any) => {
      let marketPairList = marketPair.split(':');
      fixtureIds.push(marketPairList[0]);
      gameIds.push(marketPairList[1]);
    })

    return [fixtureIds.join(','), gameIds.join(',')];
  }


  ngOnInit(): void {

    let [fixtureIds, gameIds] = this.getFixtureAndGameIds(); // array destructuring
    this.multiMatchCouponService.getCdsContent(fixtureIds, null, gameIds);
    this.multiMatchCouponCdsContent$ = this.multiMatchCouponService.multiMatchCouponCdsContent$;
    this.multiMatchCouponCdsContent$.subscribe(
      (result) => {
        this.homeAndAwayResult = result;
        this.paginatedResult = result.result;
        // Pagination logic
        if (!this.isPageIntialised || this.pageDetails?.totalPages == 0) {
          this.isPageIntialised = true;
          this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
          this.clearPageTimer();
          this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
            this.paginationSetup(this.paginatedResult);
          }));
        }
        this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.homeAwayEvent?.length);
        const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.multiMatchCouponService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );
    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.homeAndAwayResult = { ...this.multiMatchCouponService.GetUpdatedHomeDrawAwayContent(result) };
      })
  }

  paginationSetup(resultContent: any) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent?.homeAwayEvent?.length);
  }

  ngOnDestroy(): void {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }


}