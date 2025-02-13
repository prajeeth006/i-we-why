import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { JsonStringifyHelper } from '../../common/helpers/json-stringify.helper';
import { StringHelper } from '../../common/helpers/string.helper';
import { GantryCommonContent } from '../../common/models/gantry-commom-content.model';
import { ManualOutRightResult, ManualOutRightSelection } from '../../common/models/manual-outright.module';
import { ContentItemPaths } from '../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../common/services/error.service';
import { GantryCommonContentService } from '../../common/services/gantry-common-content.service';
import { Log, LogType, LoggerService } from '../../common/services/logger.service';
import { SportContentService } from '../../common/services/sport-content/sport-content.service';
import { SignalrService } from '../../common/signalRService/signalr.service';

@Injectable({
    providedIn: 'root',
})
export class ManualOutrightTemplateService {
    manualOutRightContent: ManualOutRightResult;
    constructor(
        private errorService: ErrorService,
        private signalrService: SignalrService,
        private loggerService: LoggerService,
        private gantryCommonContentService: GantryCommonContentService,
        private sportContentService: SportContentService,
    ) {
        this.subscribeToSignalR();
    }

    errorMessage$ = this.errorService.errorMessage$;
    outRightContentBehaviourSubject$ = new BehaviorSubject<ManualOutRightResult>(new ManualOutRightResult());
    manualOutrightContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.manualOutright);
    gantryCommonContent$ = this.gantryCommonContentService.data$.pipe(
        tap((gantryCommonContent: GantryCommonContent) => {
            JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as GantryCommonContent), // Initial Value
    );

    data$ = combineLatest([this.outRightContentBehaviourSubject$, this.gantryCommonContent$, this.manualOutrightContentFromSitecore$]).pipe(
        map(([manualFormContent, gantryCommonContent, manualOutrightContent]) => {
            const manualOutRightResult = new ManualOutRightResult();
            try {
                this.prepareResult(manualOutRightResult, manualFormContent, gantryCommonContent, manualOutrightContent);
            } catch (e) {
                console.error(e);
                this.log(`Error in processing ManualOutRightResult ${e}`, LogType.Error, 'NA', true);
            }
            return manualOutRightResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    subscribeToSignalR() {
        this.signalrService.hubSingleRMessage$.subscribe((eventformdata: any) => {
            if (eventformdata) {
                const eventData: ManualOutRightResult = Object.assign(new ManualOutRightResult(), eventformdata);
                this.outRightContentBehaviourSubject$.next(eventData);
            }
        });
    }

    prepareResult(
        manualOutRightResult: ManualOutRightResult,
        manualFromData: ManualOutRightResult,
        gantryCommonContent: GantryCommonContent,
        manualOutrightContent: GantryCommonContent,
    ) {
        if (manualFromData) {
            if (manualFromData?.date) {
                const getDate = this.prepareDataFormat(manualFromData?.date?.toString());
                const eventTime = manualFromData?.time ? ' ' + manualFromData?.time : '';
                const eventDate = manualFromData?.date ? getDate + eventTime : '';
                const eventDateTime: Date = new Date(eventDate);
                if (eventDateTime?.toString() != 'Invalid Date') {
                    manualOutRightResult.date = eventDateTime;
                } else {
                    console.log('Invalid event Date :', manualFromData?.date + ' ' + manualFromData?.time);
                    this.log(
                        `Error in manual outright templeate in Invalid event Date: ${manualFromData?.date + ' ' + manualFromData?.time}`,
                        LogType.Error,
                        'DateTime conversion Error',
                        true,
                    );
                }
            }
            manualOutRightResult.outRightTitle = manualFromData?.sportName?.toUpperCase();
            manualOutRightResult.eventName = manualFromData?.eventName;
            if (manualFromData?.Runners?.length > 0) {
                manualOutRightResult.Runners = new Array<ManualOutRightSelection>();
                manualFromData?.Runners?.forEach((selection) => {
                    const outRightDetails: ManualOutRightSelection = new ManualOutRightSelection();
                    outRightDetails.selectionName = selection?.selectionName;
                    const currentPrice = StringHelper.calculatedPrice(selection.odds!);
                    outRightDetails.price = currentPrice;
                    outRightDetails.odds = selection.odds;
                    manualOutRightResult.Runners.push(outRightDetails);
                });
                manualOutRightResult?.Runners.sort((a, b) => a.price! - b.price!);
            }
            manualOutRightResult.racingContent = gantryCommonContent;
            manualOutRightResult.imageContent = manualOutrightContent;
            manualOutRightResult.marketEachWay = gantryCommonContent?.contentParameters?.ManualBottomStipLine ?? '';
        }
    }

    log(message: string, level: LogType = LogType.Error, status: string, fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }

    prepareDataFormat(finalDate: string): string {
        if (finalDate?.includes('/')) {
            const [day, month, year] = finalDate.split('/');
            finalDate = month + '/' + day + '/' + year;
        } else if (finalDate?.includes('-')) {
            const [day, month, year] = finalDate.split('-');
            finalDate = month + '/' + day + '/' + year;
        }
        return finalDate;
    }
}
