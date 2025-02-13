import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith } from 'rxjs';

import { BrandImageContent } from '../../common/components/error/models/error-content.model';
import { FillerPageService } from '../../common/components/filler-page/services/filler-page.service';
import { RunnerDetailsRacingEvent } from '../../common/helpers/runner-details-racing-event.helper';
import { StringHelper } from '../../common/helpers/string.helper';
import { AvrMarket, AvrRacers, AvrResult, AvrSelection, AvrSelections } from '../../common/models/data-feed/avr.model';
import { VirtualRaceSilkRunnerImageContent } from '../../common/models/gantry-commom-content.model';
import { PriceType, SelectionNameLength } from '../../common/models/general-codes-model';
import { QueryParamEvent } from '../../common/models/query-param.model';
import { RunnerType } from '../../common/models/racing-tags.model';
import { AvrDataFeedService } from '../../common/services/data-feed/avr-service/avr-data-feed.service';
import { AvrImageService } from '../../common/services/data-feed/avr-service/avr-image.service';
import { ErrorService } from '../../common/services/error.service';
import { VirtualRaceImageService } from '../../common/services/virtual-race-image.service';
import { AvrContent } from '../models/avr-result-content.model';
import { AvrEventTypeEnum, AvrMarketEnum } from '../models/avr-result-enum.model';
import { AvrTemplate, ResultDetails } from '../models/avr-template.model';
import { AvrContentService } from './avr-result-content.service';
import { AvrCommonService } from './common/avr-common.service';

@Injectable({
    providedIn: 'root',
})
export class AvrResultService {
    avrResultPage: AvrTemplate = new AvrTemplate();
    public isResultComplete: boolean = false;
    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        startWith({} as VirtualRaceSilkRunnerImageContent), // Initial Value
    );

    avrBrandImage$ = this.avrImageService.brandImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );

    avrBackgroundImage$ = this.avrImageService.backgroundImage$.pipe(
        startWith({} as BrandImageContent), // Initial Value
    );

    staticContent$ = this.avrContentService.data$.pipe(
        startWith({} as AvrContent), // Initial Value
    );

    data$ = combineLatest([this.virtualRaceImageService$, this.avrBrandImage$, this.avrBackgroundImage$, this.staticContent$]).pipe(
        map(([runnerImageContent, brandImageContent, backgroundImageContent, staticContent]) => {
            this.avrResultPage?.resultsTable.forEach((runner) => {
                if (runnerImageContent?.runnerImages?.length >= Number(runner.runnerNumber)) {
                    runner.imageSourceUrl = runnerImageContent?.runnerImages[Number(runner.runnerNumber) - 1]?.src;
                }
            });
            this.avrResultPage.brandImageUrl = brandImageContent?.brandImage?.src;
            this.avrResultPage.backgroundImageUrl = backgroundImageContent?.brandImage?.src;
            this.avrResultPage.staticContent = staticContent;
            this.isResultComplete = this.checkResultComplete();
            if (this.avrResultPage?.resultsTable?.length <= 0) {
                throw `Couldn't find data for resultPage runners`;
            }
            this.errorService.unSetError();
            return this.avrResultPage;
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private avrDataFeedService: AvrDataFeedService,
        private errorService: ErrorService,
        private avrContentService: AvrContentService,
        private fillerPageService: FillerPageService,
        private avrImageService: AvrImageService,
        private virtualRaceImageService: VirtualRaceImageService,
        private avrCommonService: AvrCommonService,
    ) {}

    setControllerId(controllerId: string) {
        this.avrDataFeedService.setControllerId(new QueryParamEvent(controllerId));
    }

    setViewerEventCardTemplate(result: AvrResult) {
        this.avrImageService.setEventType(result?.avr?.eventType);
        this.avrResultPage = new AvrTemplate();
        this.avrResultPage = this.createViewerEventCardData(this.avrResultPage, result);
        this.isResultComplete = this.checkResultComplete();
    }

    setResultTemplate(result: AvrResult) {
        if (!this.avrResultPage?.eventName) {
            this.isResultComplete = false;
            return;
        }
        this.avrImageService.setEventType(result?.avr?.eventType);
        this.avrResultPage = this.createResultData(this.avrResultPage, result);
        this.isResultComplete = this.checkResultComplete();
    }

    private createViewerEventCardData(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
        avrResultPage.isResultedOrOff = false;
        this.avrImageService.setEventType(result?.avr?.eventType);
        avrResultPage.avrEventType = result?.avr?.eventType;
        avrResultPage.runnerCount = result.avr?.numOfRacers ? result.avr?.numOfRacers : '0';
        avrResultPage.numEachWay = result.avr?.numEachWay;
        avrResultPage.distance = result.avr?.distance?.toUpperCase();
        avrResultPage.eventName = this.avrCommonService.setEventName(result?.avr?.eventName, result.avr?.eventDateTime);
        avrResultPage = this.setRunnerDetails(avrResultPage, result.avr?.racers);
        avrResultPage = this.avrCommonService.setEachWayDetails(avrResultPage, result.avr?.tags);
        return avrResultPage;
    }

    private createResultData(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
        avrResultPage.isResultedOrOff = true;
        const runnerType = this.getRaceType(result?.avr?.eventType);
        this.avrImageService.setEventType(result?.avr?.eventType);

        avrResultPage.forecast = result?.avr?.markets?.market![0]?.fcDividend
            ? StringHelper.checkToteResults(result?.avr?.markets?.market[0]?.fcDividend?.toString())
            : '';
        avrResultPage.tricast = result?.avr?.markets?.market![0]?.tcDividend
            ? StringHelper.checkToteResults(result?.avr?.markets?.market[0]?.tcDividend?.toString())
            : '';
        avrResultPage = this.setRunnersByPosition(avrResultPage, result);
        avrResultPage.resultsTable = RunnerDetailsRacingEvent.setRunnerDetails(
            runnerType,
            Number(avrResultPage.runnerCount),
            'EACH-WAY ' + avrResultPage.eachWay,
            '',
            '',
            avrResultPage.resultsTable,
        );
        return avrResultPage;
    }

    private setRunnerDetails(avrResultPage: AvrTemplate, racers: Array<AvrRacers>): AvrTemplate {
        racers.forEach((racer: AvrRacers) => {
            const result = new ResultDetails();
            result.runnerNumber = racer.num;
            result.runnerName = StringHelper.checkSelectionNameLengthAndTrimEnd(racer?.name, SelectionNameLength.Eighteen);
            racer.price = StringHelper?.setSelectionPrice(racer?.price);
            result.price = this.setPriceDetails(racer?.price?.trim());
            result.favourite = racer.fav;
            result.isFavourite = StringHelper?.checkFavouriteTag(result.favourite);
            avrResultPage.resultsTable?.push(result);
        });
        return avrResultPage;
    }

    setPriceDetails(price: string) {
        if (!price) {
            return ' ';
        } else if (price == '1' || price == '1/1') {
            return PriceType.evs;
        } else {
            if (!price?.includes('/')) {
                return price + '/1';
            }
            return price;
        }
    }

    private setRunnersByPosition(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
        let selectionList: AvrSelections | null | undefined;
        const runnerList: Array<ResultDetails> = [];
        result?.avr?.markets?.market?.forEach((market: AvrMarket) => {
            if (market?.marketTypeKey?.toUpperCase() == AvrMarketEnum.Win) {
                selectionList = market.selections;
            }
        });
        if (selectionList && selectionList?.selection) {
            selectionList?.selection?.forEach((selection: AvrSelection) => {
                const racer = avrResultPage?.resultsTable?.find((racer) => racer.runnerNumber == selection.runnerNumber?.toString());
                if (racer) {
                    racer.position = selection?.finalPosition?.toString();
                    runnerList.push(racer);
                }
            });
        }

        if (runnerList) {
            avrResultPage.resultsTable = runnerList;
        }

        avrResultPage?.resultsTable.sort((a, b) => {
            return Number(a.position) - Number(b.position);
        });
        return avrResultPage;
    }

    getRaceType(eventType: string): string {
        let raceType = '';
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                raceType = RunnerType.Horse;
                break;
            case AvrEventTypeEnum.DogRace:
                raceType = RunnerType.Dog;
                break;
            case AvrEventTypeEnum.MotorRace:
                raceType = RunnerType.Motor;
                break;
        }
        return raceType;
    }

    private checkResultComplete(): boolean {
        if (!!this.avrResultPage?.resultsTable?.[0]?.position && !!this.avrResultPage?.eventName) {
            return true;
        }
        return false;
    }
}
