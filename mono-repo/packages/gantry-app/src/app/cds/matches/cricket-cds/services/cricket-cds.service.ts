import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { Fixture, Fixtures } from '../../../../common/cds-client/models/fixture.model';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Markets } from '../../../../common/models/gantrymarkets.model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { CricketCdsTemplateModel } from '../../../common/models/cricket-cds-template.model';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { CricketContentParams } from '../models/cricket-cds-template.model';
import { CricketTv1CdsService } from './cricket-tv1-cds.service';
import { CricketTv2CdsService } from './cricket-tv2-cds.service';

@Injectable({
    providedIn: 'root',
})
export class CricketCdsService extends SportCdsTemplateService {
    cricketCdsResult: CricketCdsTemplateModel = new CricketCdsTemplateModel();
    fixtures$: Observable<Fixtures>;
    cricketContentFromSitecore$: Observable<CricketContentParams>;
    cricketCdsContent$: Observable<CricketCdsTemplateModel>;
    fixture: Fixture;
    fixtures: Fixtures;
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
        private cricketTv1CdsService: CricketTv1CdsService,
        private cricketTv2CdsService: CricketTv2CdsService,
        gantryMarketsService: GantryMarketsService,
    ) {
        super(gantryMarketsService);
    }

    public prepareCricketCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.cricketContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.cricketCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.cricketCdsContent$ = combineLatest([this.fixtures$, this.cricketContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, cricketContentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.cricketCdsResult.content = cricketContentFromSitecore;
                    this.cricketCdsResult = this.getCricketCdsContent(this.fixture, this.gantryMarkets);
                } else {
                    throw 'Could not find cricket data for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.cricketCdsResult;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getCricketCdsContent(fixture: Fixture, gantryMarkets: Array<Markets>): CricketCdsTemplateModel {
        this.cricketCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
        this.cricketCdsResult.startDate = fixture?.startDate;
        this.cricketCdsResult.competitionName = fixture?.competition?.name?.value;
        this.cricketCdsResult.context = fixture?.context;

        if (!!fixture && fixture?.games?.length) {
            this.cricketTv1CdsService.prepareCricketTv1CdsContent(fixture, gantryMarkets, this.cricketCdsResult);
        } else if (!!fixture && fixture?.optionMarkets?.length) {
            this.cricketTv2CdsService.prepareCricketTv2CdsContent(fixture, this.cricketCdsResult);
        } else {
            const errorMessage = 'Could not find cricket data for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return this.cricketCdsResult;
    }

    public GetUpdatedCricketCdsContent(messageEnvelope: MessageEnvelope): CricketCdsTemplateModel {
        if (messageEnvelope.messageType) {
            this.fixture = super.onIncomingCdsMessageUpdateFixture(messageEnvelope, this.fixture);
            return this.getCricketCdsContent(this.fixture, this.gantryMarkets);
        }
        return new CricketCdsTemplateModel();
    }

    logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
