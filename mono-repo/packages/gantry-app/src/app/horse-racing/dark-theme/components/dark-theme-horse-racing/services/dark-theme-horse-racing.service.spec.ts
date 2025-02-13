import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';
import { DarkThemeHorseRacingService } from './dark-theme-horse-racing.service';

describe('DarkThemeHorseRacingService', () => {
    let service: DarkThemeHorseRacingService;

    const horseRacingContent: HorseRacingContent = {
        contentParameters: {
            RaceTypes: JSON.stringify({
                'Flat': 'Flat',
                'Hurdle': 'Hurdle',
                'Chase': 'Chase',
                'NH Flat': 'NHF',
            }),
            RaceTypeF: 'F',
            RaceTypeJ: 'J',
            RaceTypeFlat: 'Flat',
        },
    };

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeHorseRacingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should append RaceType Flat when flatOrJump is F', () => {
        const result = service.formatDistanceInfo('F', null, '2000m', horseRacingContent);
        expect(result).toBe('2000m Flat');
    });

    it('should append race type description when flatOrJump is J and raceType is provided', () => {
        const result = service.formatDistanceInfo('J', 'Chase', '3000m', horseRacingContent);
        expect(result).toBe('3000m Chase');
    });

    it('should append race type description when raceDistance and raceType are provided', () => {
        const result = service.formatDistanceInfo(null, 'Hurdle', '2500m', horseRacingContent);
        expect(result).toBe('2500m Hurdle');
    });

    it('should set distanceAndRaceType to race type description when only raceType is provided', () => {
        const result = service.formatDistanceInfo(null, 'NH Flat', null, horseRacingContent);
        expect(result).toBe('NHF');
    });

    it('should return raceDistance as is when no matching conditions are met', () => {
        const result = service.formatDistanceInfo(null, null, '1500m', horseRacingContent);
        expect(result).toBe('1500m');
    });

    it('should handle empty raceDistance and return raceType description if raceType is provided', () => {
        const result = service.formatDistanceInfo(null, 'Flat', '', horseRacingContent);
        expect(result).toBe('Flat');
    });
});
