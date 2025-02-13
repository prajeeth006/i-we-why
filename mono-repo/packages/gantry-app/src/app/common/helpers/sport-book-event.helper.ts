import { SportBookEventStructured } from '../models/data-feed/sport-bet-models';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { EventStatusCode, ResultStatusCode } from '../models/general-codes-model';
import { SisData } from '../models/sis-model';
import { StringHelper } from './string.helper';

export class SportBookEventHelper {
    static getPriceHeader(
        event: SportBookEventStructured,
        raceStage: string,
        gantryCommonContent: GantryCommonContent,
        sisData: SisData,
        isVirtualEvent: boolean,
    ): string {
        if (!isVirtualEvent) {
            if (!raceStage && !event.offTime) {
                return gantryCommonContent?.contentParameters ? gantryCommonContent?.contentParameters?.CoralPrice : '';
            }

            const offTimeDate = new Date(event?.offTime);
            const offTimeText = `${gantryCommonContent?.contentParameters?.RaceOff ?? ''} @ ${offTimeDate
                .getHours()
                .toString()
                .padStart(2, '0')}:${offTimeDate.getMinutes().toString().padStart(2, '0')}:${offTimeDate.getSeconds().toString().padStart(2, '0')}`;

            if (sisData?.photoFinishSelections?.some((s) => s.photoFinish === 'Y')) {
                // Photo-Finish stage
                return `${gantryCommonContent?.contentParameters?.PhotoFinish ?? ''}||||${offTimeText}`;
            }

            if (sisData?.eventStatusCode === EventStatusCode.Abandoned) {
                // Abandoned stage
                return `${gantryCommonContent?.contentParameters?.VoidRace ?? ''}||||${offTimeText}`;
            }

            if (sisData?.resultStatusCode === ResultStatusCode.StewardsEnq) {
                // Stewards' Enquiry stage
                return `${gantryCommonContent?.contentParameters?.StewardsEnquiry ?? ''}||||${offTimeText}`;
            }

            //Ravi(13/07/2022): Commenting below code as we dont need to show withdrawn with RaceOff text. this is the story we need to refer to https://jira.corp.entaingroup.com/browse/DTP-6336.
            // if (sisData?.selectionStatus?.some(s => s.status === ResultStatusCode.WeighedIn)) {
            //     // Photo-Finish stage
            //     return `${gantryCommonContent?.contentParameters?.Withdrawn}||||${offTimeText}`;
            // }

            if (event.offTime) {
                return offTimeText;
            }

            return gantryCommonContent?.contentParameters ? gantryCommonContent?.contentParameters?.LiveShow : '';
        } else {
            if (event.offTime) {
                const offTimeDate = new Date(event.offTime);
                const offTimeText = `${gantryCommonContent?.contentParameters?.RaceOff ?? ''} @ ${offTimeDate
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${offTimeDate.getMinutes().toString().padStart(2, '0')}:${offTimeDate
                    .getSeconds()
                    .toString()
                    .padStart(2, '0')}`;
                return offTimeText;
            } else return '';
        }
    }

    static removePipeSymbolsFromAllNames(event: SportBookEventStructured) {
        if (!event) return;

        event.eventName = StringHelper.removeAllPipeSymbols(event?.eventName);
        this.removeAllPipeSymbolsInMarketsAndSelections(event);
    }

    static removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(event: SportBookEventStructured) {
        if (!event) return event;

        event.eventName = StringHelper.removeAllPipeSymbols(event?.eventName)?.toLocaleUpperCase();
        event.typeName = !event.typeName ? '' : StringHelper.removeAllPipeSymbols(event?.typeName)?.toLocaleUpperCase();
        event.categoryName = !event.categoryName ? '' : StringHelper.removeAllPipeSymbols(event?.categoryName)?.toLocaleUpperCase();
        this.eventStartTimeAddedInTypeName(event);
        this.removeAllPipeSymbolsInMarketsAndSelections(event);
        return event;
    }

    static removePipeSymbolsAndUpperCaseAllNames(event: SportBookEventStructured) {
        if (!event) return event;

        event.eventName = StringHelper.removeAllPipeSymbols(event?.eventName)?.toLocaleUpperCase();
        event.typeName = !event.typeName ? '' : StringHelper.removeAllPipeSymbols(event?.typeName)?.toLocaleUpperCase();
        event.categoryName = !event.categoryName ? '' : StringHelper.removeAllPipeSymbols(event?.categoryName)?.toLocaleUpperCase();
        this.removeAllPipeSymbolsInMarketsAndSelections(event);
        return event;
    }

    static eventStartTimeAddedInTypeName(event: SportBookEventStructured) {
        if (!event) return;

        const eventStartTime = StringHelper.getBtcTime(event?.eventDateTime);
        const eventName = event?.eventName?.trim().substring(event?.eventName?.trim().indexOf(' '));
        event.eventTimePlusTypeName = !eventName ? eventStartTime : eventStartTime + ' ' + eventName;
    }

    static removeAllPipeSymbolsInMarketsAndSelections(event: SportBookEventStructured) {
        if (event && event.markets) {
            for (const [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market?.marketName)?.toLocaleUpperCase();
                if (market.selections) {
                    for (const [, selection] of market.selections) {
                        selection.selectionName = StringHelper.removeAllPipeSymbols(selection?.selectionName)?.toLocaleUpperCase();
                    }
                }
            }
        }
    }
}
