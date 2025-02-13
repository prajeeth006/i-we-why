import { TestBed } from '@angular/core/testing';

import { MockGreyhoundStaticContent } from '../../mocks/mock-greyhound-static-content';
import { PostPickNbService } from './post-pick-nb.service';

describe('PostPickNbService', () => {
    let service: PostPickNbService;
    let greyhoundStaticContent: MockGreyhoundStaticContent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PostPickNbService);
        greyhoundStaticContent = new MockGreyhoundStaticContent();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when postPickNap and postPickNextBest both are false then result should be string ', () => {
        const postPick = '6-5-4';
        const postPickNap: boolean = false;
        const postPickNextBest: boolean = false;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('');
    });
    it('when postPickNap true and postPickNextBest false then result should be NAP', () => {
        const postPick = '6-5-4';
        const postPickNap: boolean = true;
        const postPickNextBest: boolean = false;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('NAP');
    });
    it('when postPickNap false and postPickNextBest true then result should be NB', () => {
        const postPick = '6-5-4';
        const postPickNap: boolean = false;
        const postPickNextBest: boolean = true;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('NB');
    });
    it('when postPickNap and postPickNextBest both are true then result should be NAP', () => {
        const postPick = '6-5-4';
        const postPickNap: boolean = true;
        const postPickNextBest: boolean = true;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('NAP');
    });
    it('when postPickNap and postPickNextBest both are true then result should be Empty', () => {
        const postPick = '';
        const postPickNap: boolean = true;
        const postPickNextBest: boolean = true;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('');
    });
    it('when postPickNap and postPickNextBest both are empty then result should be string', () => {
        const postPick = '6-5-4';
        let postPickNap: boolean;
        let postPickNextBest: boolean;

        const postPickNbService = service.setPostPickNb(postPickNap, postPickNextBest, greyhoundStaticContent.greyhoundRacingContent, postPick);
        expect(postPickNbService).toBe('');
    });

    it('racingpostimage is displayed for the given position', () => {
        const greyhoundRacingPostTip: string[] = [];
        const position = '5';

        const racingPostImage = service.setRacingPostTipImageByPositions(
            greyhoundRacingPostTip,
            position,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(racingPostImage[0]).toBe('https://scmedia.cms.test.env.works/$-$/a0509ce852074315aa65e6035a2fcda6.svg');
    });

    it('getpostpick is empty then setRacingPostTipImageByPositions is not haven been called   ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntry,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).not.toHaveBeenCalled();
    });

    it('getpostpick runner is updating top3Positions with Runner6  ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6-5-4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntryForRunner6,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('6');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });

    it('getpostpick runner is updating top3Positions with Runner5  ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6-5-4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntry,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('5');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });
    it('getpostpick runner is updating top3Positions with Runner4  ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6-5-4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntryForRunner4,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('4');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });
    it('getpostpick runner is updating top3Positions with Runner6 as trim ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6 -5-4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntryForRunner6,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('6');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });

    it('getpostpick runner is updating top3Positions with Runner5 as trim  ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6- 5-4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntry,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('5');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });
    it('getpostpick runner is updating top3Positions with Runner4 as trim  ', () => {
        greyhoundStaticContent.racingContentResult.postPick = '6-5- 4';
        spyOn(service, 'setRacingPostTipImageByPositions').and.callThrough();
        service.getPostPick(
            greyhoundStaticContent.racingContentResult,
            greyhoundStaticContent.greyhoundRacingEntryForRunner4,
            greyhoundStaticContent.top3Positions,
            greyhoundStaticContent.greyHoundRacingRunnersResult,
            greyhoundStaticContent.greyhoundRacingContent,
        );
        expect(service.setRacingPostTipImageByPositions).toHaveBeenCalled();
        expect(greyhoundStaticContent.top3Positions[0]).toBe('4');
        expect(greyhoundStaticContent.top3Positions.length).toBeGreaterThan(0);
    });
});
