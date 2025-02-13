import { TestBed } from '@angular/core/testing';

import { TrapChallengeResult } from '../../../models/trap-challenge.model';
import { MockGreyhoundStaticContent, TrapChallengeMockData } from '../mocks/mock-trap-challenge-data';
import { TrapChallengeTemplateService } from './trap-challenge-template.service';

describe('TrapChallengeTemplateService', () => {
    let service: TrapChallengeTemplateService;
    let trapChallengeMockData: TrapChallengeMockData;
    let mockGreyhoundStaticContent: MockGreyhoundStaticContent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        trapChallengeMockData = new TrapChallengeMockData();
        mockGreyhoundStaticContent = new MockGreyhoundStaticContent();
        service = TestBed.inject(TrapChallengeTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('check trap challenge event count should be match', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events.length).toBe(4);
    });

    it('check trap challenge first event sorted by event date time', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events[0].name).toBe('SRIRAM TESTING');
    });

    it('check trap challenge traps count should be match', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events[1]?.selections.length).toBe(6);
    });

    it('check trap challenge first traps should be in sorted order in a meeting', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events[2]?.selections[0]?.runnerNumber).toBe(1);
    });

    it('check trap challenge last traps should be in sorted order in a meeting', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events[3]?.selections[5]?.runnerNumber).toBe(6);
    });

    it('check trap challenge traps price should match', () => {
        const response: TrapChallengeResult = service.prepareResult(
            trapChallengeMockData.sportBookResult,
            mockGreyhoundStaticContent.greyhoundRacingContent,
        );
        expect(response.events[2]?.selections[5]?.price).toBe('6/5');
    });

    it("Page shouldn't broke because of unexpected DF data", () => {
        expect(service.prepareResult(undefined, undefined)).not.toBeUndefined();
    });
});
