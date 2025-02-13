import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { Subscription, interval } from 'rxjs';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { GolfCdsTemplateResult } from '../models/golf-cds-template.model';
import { GolfCdsService } from '../services/golf-cds.service';

@Component({
  selector: 'gn-golf-cds',
  templateUrl: './golf-cds.component.html',
  styleUrls: ['./golf-cds.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class GolfCdsComponent implements OnInit {
  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.golfCdsService.errorMessage$;
  updatedFixture: FixtureView
  fixtureId: any = []; marketIds: any = []; gameIds: any;
  eventMarketPairs: any;
  golfCDSContent: GolfCdsTemplateResult = new GolfCdsTemplateResult();
  paginatedResult: any;
  pageDetails: PaginationContent = new PaginationContent();
  pageTimerSubscription: Subscription;
  pageRefreshTime = 20000;
  isPageIntialised = false;

  constructor(routeDataService: RouteDataService,
    private cdsPushProvider: CdsPushProvider,
    private cdsClientService: CdsClientService,
    private golfCdsService: GolfCdsService,
    private paginationService: PaginationService) {
    let queryParams = routeDataService.getQueryParams();
    this.eventMarketPairs = queryParams['eventMarketPairs'];
    this.pageDetails.pageSize = PageSizes.Four;

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
    this.golfCdsService.GetGolfCdsContent(fixtureIds, null, gameIds);
    this.golfCdsService.golfCdsContent$.subscribe(
      (result) => {
        this.golfCDSContent = result;
        this.paginatedResult = result;

        // Pagination logic
        if (!this.isPageIntialised || this.pageDetails?.totalPages == 0) {
          this.isPageIntialised = true;
          this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
          this.clearPageTimer();
          this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
            this.paginationSetup(this.paginatedResult);
          }));
        }
        this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.golfData?.gameDetails?.length);
        const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.golfCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.golfCDSContent = { ...this.golfCdsService.GetUpdateGolfDataContent(result) }
      })
  }

  paginationSetup(resultContent: any) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent?.golfData?.gameDetails?.length);
  }

  ngOnDestroy(): void {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }
}
