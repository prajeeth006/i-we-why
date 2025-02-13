
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { HomeDrawAwayResult } from '../models/home-draw-away-content.model'
import { HomeDrawAwayService } from '../services/home-draw-away.service';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from "src/app/common/services/error.service";
import { Log, LoggerService, LogType } from 'src/app/common/services/logger.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { interval, Observable, Subscription } from 'rxjs';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';


@Component({
  selector: 'gn-home-draw-away',
  templateUrl: './home-draw-away.component.html',
  styleUrls: ['./home-draw-away.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HomeDrawAwayComponent implements OnInit {
  nameLength = SelectionNameLength.Seventeen;
  homeDrawAwayResult: HomeDrawAwayResult = new HomeDrawAwayResult();
  updatedFixture: FixtureView
  fixtureId: any = []; marketIds: any = []; gameIds: any;
  eventMarketPairs: any;
  errorMessage$ = this.homeDrawAwayService.errorMessage$;
  homeDrawAwayResult$: Observable<HomeDrawAwayResult>;
  pageTimerSubscription: Subscription;
  paginatedResult: HomeDrawAwayResult;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  isPageIntialised = false;

  constructor(routeDataService: RouteDataService, private cdsPushProvider: CdsPushProvider, private paginationService: PaginationService, private loggerService: LoggerService, private errorService: ErrorService, private homeDrawAwayService: HomeDrawAwayService, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.eventMarketPairs = queryParams['eventMarketPairs'];
    this.getFixtureIds();
    this.pageDetails.pageSize = PageSizes.Nine;

  }

  getFixtureIds() {
    if (this.eventMarketPairs !== undefined) {
      const splitPairs = this.eventMarketPairs?.split(',');
      splitPairs.forEach((marketPair: any) => {
        if (marketPair.split(':').length == 3) {
          this.fixtureId.push(marketPair.split(':')[0] + ':' + marketPair.split(':')[1]);
          this.marketIds.push(marketPair.split(':')[2]);
        }
        else {
          this.fixtureId.push('2:' + marketPair.split(':')[0]);
          this.marketIds.push(marketPair.split(':')[1]);
        }
      })
    }
  }
  ngOnInit(): void {
    this.homeDrawAwayService.GetHomeDrawAwayContent(this.fixtureId, this.marketIds, '');
    this.homeDrawAwayResult$ = this.homeDrawAwayService?.homeDrawAwayResult$;
    this.homeDrawAwayResult$.subscribe(
      (result) => {
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
        this.paginationService?.calculateTotalPages(this.pageDetails, this.paginatedResult?.homeDrawAwayEvent?.length);

        this.homeDrawAwayResult = result;

        if (this.homeDrawAwayResult?.homeDrawAwayEvent?.length == 0) {
          this.logError(this.cdsClientService?.fixturesUrl, 'Foot-Ball content not found', "ContentNotFound");
          this.errorService.logError(this.cdsClientService?.fixturesUrl);
        }
        const topics = this.cdsClientService?.getSubscriptionRequestForFixtures(this.homeDrawAwayService?.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );
    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.homeDrawAwayResult = this.homeDrawAwayService.GetUpdatedHomeDrawAwayContent(result);
      })
  }

  logError(url: string, message: string, status: string, fatal: boolean = false) {
    let errorLog: Log = {
      level: LogType.Error,
      message: 'Could not find data for Url: ' + url + ' because ' + message,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(errorLog);
  }
  paginationSetup(resultContent: HomeDrawAwayResult) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent.homeDrawAwayEvent.length);
  }

  ngOnDestroy(): void {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }
}
