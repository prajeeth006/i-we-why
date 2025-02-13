import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';
import { EMPTY, catchError } from 'rxjs';

import { StringHelper } from '../../../../../common/helpers/string.helper';
import {
    MOCK_BrandImage_Content,
    MOCK_MANUAL_HORSE_RACING,
    MockManualHorseRacingResponse,
    MockManualHorseRunners,
} from '../mocks/dark-theme-mock-manual-horse-racing-data';
import { DarkThemeManualHorseRacingTemplateService } from './dark-theme-manual-horse-racing-template.service';

describe('DarkThemeManualHorseRacingTemplateService', () => {
    let service: DarkThemeManualHorseRacingTemplateService;
    let mockManualHorseRacingResData: MockManualHorseRacingResponse;
    let mockManualHorseRunners: MockManualHorseRunners;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        mockManualHorseRacingResData = new MockManualHorseRacingResponse();
        mockManualHorseRunners = new MockManualHorseRunners();
        service = TestBed.inject(DarkThemeManualHorseRacingTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return 10 if oddsprice is "10/1"', () => {
        expect(StringHelper.calculatedPrice('10/1')).toBe(10);
    });

    it('should return 10 if oddsprice is "10/"', () => {
        expect(StringHelper.calculatedPrice('10/')).toBe(10);
    });

    it('should return 10 if oddsprice is "10"', () => {
        expect(StringHelper.calculatedPrice('10')).toBe(10);
    });

    it('when setEachWay with WIN ONLY parameters called the result should not be null', () => {
        const result = service.setEachWay('WIN ONLY');
        expect(result).toBe('WIN ONLY');
    });

    it('should format each way from "2 places 1/4 odds" to "1/4 odds 1-2"', () => {
        const result = service.setEachWay('2 places 1/4 odds');
        expect(result).toBe('1/4 odds 1-2');
    });

    it('should format each way from "WIN OR EACH WAY" to "EACH WAY "', () => {
        const result = service.setEachWay('WIN OR EACH WAY');
        expect(result).toBe('EACH WAY ');
    });

    it('should format each way from "BETTING WITHOUT" to "BETTING WITHOUT"', () => {
        const result = service.setEachWay('BETTING WITHOUT');
        expect(result).toBe('BETTING WITHOUT');
    });

    it('should format each way from "4 WIN EACH WAY" to "EACH WAY 1-2-3-4"', () => {
        const result = service.setEachWay('4 WIN EACH WAY');
        expect(result).toBe('EACH WAY 1-2-3-4');
    });

    it('when setHorseRacingEntries with not null parameters called the result should not be null', () => {
        const result = service.setHorseRacingEntries(mockManualHorseRacingResData, [mockManualHorseRunners], 'Testimage');
        expect(result).not.toBeNull();
    });

    it('should initialize data$ with help of setHorseRacingData method', () => {
        const result = service.setHorseRacingData(
            mockManualHorseRacingResData.manualHorseRacingRunners.horseRacingContent,
            MOCK_MANUAL_HORSE_RACING,
            MOCK_BrandImage_Content,
        );
        expect(result).not.toBeNull();
        expect(result.manualHorseRacingRunners).not.toBeNull();
        expect(result.manualHorseRacingRunners.horseRacingContent).not.toBeNull();
        expect(result.manualHorseRacingRunners.racingContent.raceNo).toBe(1);
    });

    it('should handle error in racingContent$', () => {
        service.racingContent$ = service.racingContentBehaviourSubject$.pipe(
            catchError(() => {
                return EMPTY;
            }),
        );

        service.racingContent$.subscribe((result) => {
            expect(result).toEqual(null);
        });
    });
});
