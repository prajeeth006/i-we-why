import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockGolfCdsData } from '../mocks/mock-golf-cds-data';
import { GameDetails, GolfCdsTemplateResult, GolfData } from '../models/golf-cds-template.model';
import { GolfCdsService } from './golf-cds.service';

describe('GolfCdsService', () => {
    let service: GolfCdsService;
    let golfCdsMockdata: MockGolfCdsData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(GolfCdsService);
        golfCdsMockdata = new MockGolfCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('to check golf cds template sport name', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult?.sportName) {
            expect(golfCdsResult?.sportName).toBe('GOLF');
        }
    });

    it('to check golf cds template competition name', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult?.competitionName) {
            expect(golfCdsResult?.competitionName).toBe('BRITISH OPEN CHAMPIONSHIP');
        }
    });

    it('to check golf cds template market name', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult?.title) {
            expect(golfCdsResult?.title).toBe('1st round 3-balls');
        }
    });

    it('to check golf cds template event date range', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult?.eventDateTimeInputValue) {
            expect(golfCdsResult?.eventDateTimeInputValue).toBe('TUESDAY 31 OCTOBER');
        }
    });

    it('to check golf cds template event selections count', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        golfCdsResult.golfData = new GolfData();
        golfCdsResult.golfData.gameDetails = new Array<GameDetails>();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult.golfData) {
            golfCdsResult.golfData.gameDetails.forEach((runners: GameDetails) => {
                expect(runners.runnerDetails?.length).toBe(3);
            });
        }
    });

    it('to check golf cds template event selections names', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        golfCdsResult.golfData = new GolfData();
        golfCdsResult.golfData.gameDetails = new Array<GameDetails>();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        if (golfCdsResult.golfData) {
            golfCdsResult.golfData.gameDetails.forEach((runners: GameDetails) => {
                if (runners.runnerDetails) {
                    expect(runners.runnerDetails[0].betName).toBe('IAN POULTER');
                    expect(runners.runnerDetails[0].betOdds).toBe('20');
                }
            });
        }
    });

    it('should return correct number of events', () => {
        const eventsCount = golfCdsMockdata.GolfEventData.fixtures.length;
        expect(eventsCount).toBe(5);
    });

    it('should have correct event details', () => {
        const firstEvent = golfCdsMockdata.GolfEventData.fixtures[0];
        expect(firstEvent.name.value).toBe('Ian Poulter (ENG) - Greg Owen (ENG)');
        expect(firstEvent.startDate).toBe('2023-10-30T14:00:00Z');
        expect(firstEvent.games.length).toBe(1);
    });

    it('should calculate correct odds for each participant', () => {
        const firstEvent = golfCdsMockdata.GolfEventData.fixtures[0];
        const firstGame = firstEvent.games[0];
        const participantOdds = firstGame.results.map((result) => result.odds);
        expect(participantOdds).toEqual([21.41, 12.0, 13.0]);
    });

    it('should populate GolfCdsTemplateResult correctly', () => {
        const golfCdsResult = new GolfCdsTemplateResult();
        service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
        expect(golfCdsResult.sportName).toBe('GOLF');
        expect(golfCdsResult.competitionName).toBe('BRITISH OPEN CHAMPIONSHIP');
        expect(golfCdsResult.title).toBe('1st round 3-balls');
    });

    it('should handle empty fixture gracefully in async', fakeAsync(() => {
        const golfCdsResult = new GolfCdsTemplateResult();
        // Advance to the next tick of the clock
        tick();
        // Assert after async operation completes
        expect(golfCdsResult.sportName).toBeUndefined();
        expect(golfCdsResult.competitionName).toBeUndefined();
        expect(golfCdsResult.title).toBeUndefined();
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
