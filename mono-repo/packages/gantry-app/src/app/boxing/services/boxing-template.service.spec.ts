import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';
import { MockBoxingData } from '../mocks/mocks-boxing-data.mock';
import { BoxingTemplateService } from './boxing-template.service';

describe('BoxingTemplateService', () => {
    let service: BoxingTemplateService;
    let mockBoxingData: MockBoxingData;
    let gantryMockData: GantryMock;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(BoxingTemplateService);
        mockBoxingData = new MockBoxingData();
        gantryMockData = new GantryMock();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('set event key and market keys', () => {
        expect(service.setEvenKeyAndMarketKeys(mockBoxingData.eventId, mockBoxingData.marketIds)).toBe();
    });

    it('Check boxing for fight betting market and check home team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).mainEventInfoPanel
                .homeFighterDetails.betName,
        ).toBe('DANIEL JACOBS');
    });

    it('Check boxing for fight betting market and check away team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).mainEventInfoPanel
                .awayFighterDetails.betName,
        ).toBe('JOHN RYDER');
    });

    it('Check boxing for group betting market and check home team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data)
                .groupRoundBettingInfoPanel?.homeTeamListDetails[0]?.betName,
        ).toBe('ROUNDS 1-3');
    });

    it('Check boxing for group winning betting market and check away team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data)
                .groupRoundBettingInfoPanel.awayTeamListDetails[1].betName,
        ).toBe('ROUNDS 4-6');
    });

    it('Check boxing for round betting market and check home team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).roundBettingInfoPanel
                .homeTeamListDetails[0]?.betName,
        ).toBe('ROUND 1');
    });

    it('Check boxing for round betting market and check away team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).roundBettingInfoPanel
                .awayTeamListDetails[1].betName,
        ).toBe('ROUND 2');
    });

    it('Check boxing for method of victory betting market and check home team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).methodOfVictoryInfoPanel
                .homeTeamListDetails[1].betName,
        ).toBe('KO / TKO / DISQUALIFICATION');
    });

    it('Check boxing for method of victory betting market and check away team bet name', () => {
        expect(
            service.prepareResult(mockBoxingData.sportBookResult, mockBoxingData.boxingMockDataContent, gantryMockData.Data).methodOfVictoryInfoPanel
                .awayTeamListDetails[0].betName,
        ).toBe('BY DECISION OR TECHNICAL DECISION');
    });
});
