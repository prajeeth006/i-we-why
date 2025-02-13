import { Component, OnInit } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';

import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from "src/app/common/services/error.service";
import { Log, LoggerService, LogType } from 'src/app/common/services/logger.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { Observable } from 'rxjs';
import { NflCdsContent } from '../models/nfl-cds-content.model';
import { NflCdsService } from '../services/nfl-cds.service';


@Component({
  selector: 'gn-nfl-cds',
  templateUrl: './nfl-cds.component.html',
  styleUrls: ['./nfl-cds.component.scss']
})
export class NflCdsComponent implements OnInit {
  nameLength = SelectionNameLength.Seventeen;
  nflCDSContent: NflCdsContent = new NflCdsContent();
  updatedFixture: FixtureView
  fixtureId: any; marketIds: any; gameIds: any;
  errorMessage$ = this.nflCdsService.errorMessage$;
  nflCDSContent$: Observable<NflCdsContent>;

  constructor(routeDataService: RouteDataService, private loggerService: LoggerService, private errorService: ErrorService,private nflCdsService: NflCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];

  }

  ngOnInit(): void {
    this.nflCdsService.GetNflCdsContent(this.fixtureId, '',  this.gameIds);
    this.nflCDSContent$ = this.nflCdsService.nflCdsContent$;
    this.nflCDSContent$.subscribe(
      (result) => {
        this.nflCDSContent = result;
        if(!!!this.nflCDSContent.sportName){
          this.logError(this.cdsClientService.fixtureViewUrl, 'Nfl content not found', "ContentNotFound");
          this.errorService.logError(this.cdsClientService.fixtureViewUrl);
        }
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.nflCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );
     this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.nflCDSContent = this.nflCdsService.GetUpdatedNflCdsContent(result);
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
}
