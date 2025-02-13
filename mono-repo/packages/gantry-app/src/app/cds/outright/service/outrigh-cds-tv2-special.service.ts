import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';

import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture } from '../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../common/helpers/string.helper';
import { EventStatus } from '../../../common/models/general-codes-model';
import { ErrorService } from '../../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../../common/services/logger.service';
import { FinalResult, OutRightCdsContent, OutRightContentParams, Selections } from '../models/outright-cds.model';

@Injectable({
    providedIn: 'root',
})
export class OutrighCdsTv2SpecialService {
    outRightCDSTv2Content: OutRightCdsContent = new OutRightCdsContent();
    errorMessage$ = this.errorService.errorMessage$;
    fixture: Fixture;

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
    ) {}

    public getOutRightTv2Content(fixture: Fixture, outrightCdsContent?: OutRightContentParams): OutRightCdsContent {
        if (outrightCdsContent) this.outRightCDSTv2Content.content = outrightCdsContent;
        this.outRightCDSTv2Content.sportName = fixture?.sport?.name?.value?.toUpperCase();
        this.outRightCDSTv2Content.title = StringHelper.getCdsOutrightFixtureTitle(fixture?.fixtureGroup?.name?.value?.toUpperCase());
        this.outRightCDSTv2Content.eventStartDate = fixture?.startDate;
        this.outRightCDSTv2Content.games = [];
        if (!fixture) {
            const errorMessage = 'Data is not available for the CDS client url: ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        } else {
            this.fixture = fixture;
            let marketStatus = undefined;
            if (
                fixture?.participants &&
                fixture?.participants?.length > 0 &&
                fixture.participants[0].options &&
                fixture.participants[0].options?.length > 0
            ) {
                const fixtureOptions = fixture.participants[0].options[0];
                marketStatus = fixtureOptions.marketStatus;
                this.outRightCDSTv2Content.eachWayTerms = SportBookMarketHelper.getDarkThemeEachWayString(
                    fixtureOptions.properties?.placeTerms,
                    this.outRightCDSTv2Content?.content,
                );
            }

            if (!!marketStatus && marketStatus?.toUpperCase() == EventStatus.Suspended) {
                const errorMessage = 'This tournament has been Suspended : ' + this.cdsClientService.fixturesUrl;
                this.errorService.setError(errorMessage);
            } else {
                if (this.errorService.isSnapshotDataAvailable) {
                    this.errorService.unSetError();
                }
                if (fixture) this.outRightCDSTv2Content.finalResult = this.getOutrightSelectionDataSpecial(fixture);
            }

            if (!this.outRightCDSTv2Content?.finalResult?.selections || this.outRightCDSTv2Content?.finalResult?.selections?.length <= 0) {
                const errorMessage = 'No selections to display: ' + this.cdsClientService.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
        }

        return this.outRightCDSTv2Content;
    }

    public getUpdatedOutRightCdsTv2Content(messageEnvelope: MessageEnvelope): OutRightCdsContent {
        let participantIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.participantUpdate) {
                if (messageEnvelope?.payload?.participant?.participantId && this.fixture?.participants) {
                    participantIndex = this.fixture?.participants?.findIndex(
                        (x) => x.participantId == messageEnvelope?.payload?.participant?.participantId,
                    );
                    if (participantIndex != -1) {
                        this.fixture.participants[participantIndex] = messageEnvelope?.payload?.participant;
                    } else {
                        this.fixture?.participants?.push(messageEnvelope?.payload?.participant);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.participantDelete) {
                if (this.fixture?.participants) {
                    participantIndex = this.fixture?.participants?.findIndex(
                        (x) => x.participantId == messageEnvelope?.payload?.participant?.participantId,
                    );
                    this.fixture?.participants?.splice(participantIndex, 1);
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            if (this.fixture) return this.getOutRightTv2Content(this.fixture);
        }
        return new OutRightCdsContent();
    }

    getOutrightSelectionDataSpecial = (fixture: Fixture): FinalResult => {
        return {
            id: fixture.id,
            gameName: this.getMarketNameSpecial(fixture),
            selections: fixture?.participants?.length ? this.prepareSelectionsSpecial(fixture) : [],
        };
    };

    prepareSelectionsSpecial = (fixture: Fixture): Selections[] => {
        let numerator: number;
        let denominator: number;
        const participants = fixture?.participants;
        let selections: Selections[] = [];

        if (participants)
            selections = participants?.map((participant) => {
                return {
                    selectionPrice: SportBookMarketHelper.getCdsPriceStr(
                        participant?.options?.length > 0 ? participant?.options[0]?.participantPriceStatus : '',
                        participant?.options?.length > 0 && participant?.options[0]?.price ? participant?.options[0]?.price?.numerator : numerator,
                        participant?.options?.length > 0 && participant?.options[0]?.price
                            ? participant?.options[0]?.price?.denominator
                            : denominator,
                    ),
                    selectionName: StringHelper.getCdsFixtureTitle(participant?.name ? participant?.name?.value?.replace(',', '.') : ''),
                };
            });
        selections = SportBookMarketHelper.sortSelectionsByPrice(selections);
        const activeSelections = StringHelper.getValidSelections(selections);
        return activeSelections;
    };

    getMarketNameSpecial(fixture: Fixture) {
        const marketName = fixture?.name?.value;
        return marketName?.toUpperCase();
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
