import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../../../common/mocks/route-data-service.mock';
import { ScreenTypeService } from '../../../../../../../common/services/screen-type.service';
import { HorseRacingRunnersResult, MaxFixedViewrRunner, SplitScreenQueryParams } from '../../../../../../models/horse-racing-template.model';
import { MockDarkThemHorseRacingResultsData } from '../../../mocks/mock-dark-theme-horse-racing-results-data';
import { DarkThemeRCRunnersComponent } from '../dark-theme-rc-runners.component';
import { DarkThemeRcRunnersService } from './dark-theme-rc-runners.service';

describe('DarkThemeRCRunnersComponent', () => {
    let fixture: ComponentFixture<DarkThemeRCRunnersComponent>;
    let mockData: MockDarkThemHorseRacingResultsData;
    let service: DarkThemeRcRunnersService;
    let screenTypeService: ScreenTypeService;
    let runnersLength: number;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeRCRunnersComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        fixture = TestBed.createComponent(DarkThemeRCRunnersComponent);
        service = TestBed.inject(DarkThemeRcRunnersService);
        screenTypeService = TestBed.inject(ScreenTypeService);
        mockData = new MockDarkThemHorseRacingResultsData();
        runnersLength = mockData.racingContent.horses.length;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when maxFixedViewRunner with not null parameters called the result should not be null', () => {
        const result = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result).not.toBeNull();
    });

    it('when screen type is half,asset Type = rc runner, Fixed and Viewer runner count should be correct', () => {
        service.isRCEnabled = true;
        service.isHalfSplittingEnabled = true;
        const result: MaxFixedViewrRunner = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(0);
        expect(result.maxViewRunners).toBe(10);
    });

    it('when screen type = half, asset Type = scrolling, Fixed and Viewer runner count should be correct 5,8', () => {
        service.isHalfSplittingEnabled = true;
        service.isRCEnabled = false;
        service.isScrollingEnabled = true;
        mockData.showPostPick = true;
        service.isRacingPostVerdictCountries = true;
        service.isDiomedPresent = true;

        const result: MaxFixedViewrRunner = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is full, Fixed and Viewer runner count should be correct', () => {
        service.isHalfSplittingEnabled = false;
        const result: MaxFixedViewrRunner = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is quad, Fixed and Viewer runner count should be correct', () => {
        service.isQuadSplittingEnabled = true;
        const result: MaxFixedViewrRunner = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is undefined, Fixed and Viewer runner count should be correct', () => {
        const result: MaxFixedViewrRunner = service.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is undefined, prepareSplitScreenMaxFixedViewRunner should set correct Fixed and Viewer runner count', () => {
        const result: MaxFixedViewrRunner = service.prepareSplitScreenMaxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(7);
        expect(result.maxViewRunners).toBe(10);
    });

    it('should return correct template for 4 runners in full & quad screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(4, mockData);
        expect(template).toBe('rcTemplate4');
    });

    it('should return correct template for 4 runners in half screen', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(4, mockData);
        expect(template).toBe('rcTemplate6');
    });

    it('should return correct template for 6 runners in full & quad screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(6, mockData);
        expect(template).toBe('rcTemplate6');
    });

    it('should return correct template for 6 runners in half screen', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(6, mockData);
        expect(template).toBe('rcTemplate6');
    });

    it('should return correct template for 8 runners in full & quad screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(8, mockData);
        expect(template).toBe('');
    });

    it('should return correct template for 8 runners in half screen', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(8, mockData);
        expect(template).toBe('rcTemplate8');
    });

    it('should return correct template for 9 runners in full screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(9, mockData);
        expect(template).toBe('rcTemplate10');
    });

    it('should return correct template for 10 runners in full & quad screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(10, mockData);
        expect(template).toBe('rcTemplate10');
    });

    it('should return correct template for 10 runners in half screen', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(10, mockData);
        expect(template).toBe('');
    });

    it('should return correct template for 11 runners', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(runnersLength, mockData);
        expect(template).toBe('rcTemplate12');
    });

    it('should return correct template for 13 runners', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(13, mockData);
        expect(template).toBe('rcTemplate14');
    });

    it('should return correct template for 15 runners', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(15, mockData);
        expect(template).toBe('rcTemplate16');
    });

    it('should return correct template for 18 runners in full screen', () => {
        screenTypeService.isHalfScreenType = false;
        const template = service.getRcTemplate(18, mockData);
        expect(template).toBe('rcTemplate20');
    });

    it('should return correct template for 18 runners in half screen', () => {
        screenTypeService.isHalfScreenType = true;
        const template = service.getRcTemplate(18, mockData);
        expect(template).toBe('');
    });

    it('should return correct template class for 6 runners in full screen current page 1, total pages 2, total runner 12', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '6',
            maxRunnerCount: '12',
            totalPages: '2',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(12, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate6');
    });

    it('should return correct template class for 6 runners in full screen current page 3, total pages 3, total runner 25', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '17',
            endPageIndex: '25',
            maxRunnerCount: '25',
            totalPages: '3',
            currentPage: '3',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(25, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate10');
    });

    it('should return correct template class for page 1 with 37 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '8',
            maxRunnerCount: '37',
            totalPages: '4',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(37, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate8');
    });

    it('should return correct template class for page 2 with 37 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '9',
            endPageIndex: '16',
            maxRunnerCount: '37',
            totalPages: '4',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(37, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate8');
    });

    it('should return correct template class for page 3 with 37 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '17',
            endPageIndex: '26',
            maxRunnerCount: '37',
            totalPages: '4',
            currentPage: '3',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(37, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate10');
    });

    it('should return correct template class for page 4 with 37 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '27',
            endPageIndex: '37',
            maxRunnerCount: '37',
            totalPages: '4',
            currentPage: '4',
        };
        screenTypeService.isHalfScreenType = false;
        const template = service.getSplitScreenTemplate(37, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate10');
    });

    it('should return correct template for 8 runners in half screens', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '17',
            endPageIndex: '33',
            maxRunnerCount: '33',
            totalPages: '2',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(33, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate16 adjusted-scroll');
    });

    it('it should return correct template class for page 1 with 20 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '10',
            maxRunnerCount: '20',
            totalPages: '2',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(20, mockData, splitScreenQueryParams);
        expect(template).toBe('');
    });

    it('should return correct template class for page 2 with 20 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '11',
            endPageIndex: '20',
            maxRunnerCount: '20',
            totalPages: '2',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(20, mockData, splitScreenQueryParams);
        expect(template).toBe('');
    });
    it('should return correct template class for page 1 with 21 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '10',
            maxRunnerCount: '21',
            totalPages: '2',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(21, mockData, splitScreenQueryParams);
        expect(template).toBe('');
    });

    it('should return correct template class for page 2 with 21 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '11',
            endPageIndex: '21',
            maxRunnerCount: '21',
            totalPages: '2',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(21, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate12');
    });
    it('should return correct template class for page 1 with 31 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '16',
            maxRunnerCount: '31',
            totalPages: '2',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(31, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate16');
    });

    it('should return correct template class for page 2 with 31 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '17',
            endPageIndex: '31',
            maxRunnerCount: '31',
            totalPages: '2',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(31, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate16');
    });
    it('should return correct template class for page 1 with 32 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '1',
            endPageIndex: '16',
            maxRunnerCount: '32',
            totalPages: '2',
            currentPage: '1',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(32, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate16');
    });

    it('should return correct template class for page 2 with 32 runners', () => {
        const splitScreenQueryParams: SplitScreenQueryParams = {
            startPageIndex: '17',
            endPageIndex: '32',
            maxRunnerCount: '32',
            totalPages: '2',
            currentPage: '2',
        };
        screenTypeService.isHalfScreenType = true;
        const template = service.getSplitScreenTemplate(32, mockData, splitScreenQueryParams);
        expect(template).toBe('rcTemplate16');
    });

    it('should set isRCEnabled to true for runnercount asset type', () => {
        const queryParams = { racingAssetType: 'runnercount' } as Params;

        service.enableRacingAssetTypeFalg(queryParams);

        expect(service.isRCEnabled).toBeTrue();
        expect(service.isScrollingEnabled).toBeFalse();
        expect(service.isHalfSplittingEnabled).toBeFalse();
        expect(service.isQuadSplittingEnabled).toBeFalse();
    });

    it('should set isScrollingEnabled to true for scrolling asset type', () => {
        const queryParams = { racingAssetType: 'scrolling' } as Params;

        service.enableRacingAssetTypeFalg(queryParams);

        expect(service.isScrollingEnabled).toBeTrue();
        expect(service.isRCEnabled).toBeFalse();
        expect(service.isHalfSplittingEnabled).toBeFalse();
        expect(service.isQuadSplittingEnabled).toBeFalse();
    });

    it('should not set any flags if racingAssetType is not provided', () => {
        const queryParams = {} as Params;

        service.enableRacingAssetTypeFalg(queryParams);

        expect(service.isRCEnabled).toBeFalse();
        expect(service.isScrollingEnabled).toBeFalse();
        expect(service.isHalfSplittingEnabled).toBeFalse();
        expect(service.isQuadSplittingEnabled).toBeFalse();
    });

    it('should correctly set split screen parameters using getSplitScreenDetails', () => {
        const queryParams = {
            startPageIndex: '2',
            endPageIndex: '10',
            maxRunnerCount: '15',
            totalPages: '3',
            currentPage: '2',
        } as Params;

        service.getSplitScreenDetails(queryParams);

        expect(service.splitScreenParams).toEqual({
            startPageIndex: '2',
            endPageIndex: '10',
            maxRunnerCount: '15',
            totalPages: '3',
            currentPage: '2',
        });
    });

    it('should enable isQuadSplittingEnabled and set splitScreenParams for quadScreensplitting asset type', () => {
        const queryParams = {
            racingAssetType: 'quadscreensplit',
            startPageIndex: '1',
            endPageIndex: '10',
            maxRunnerCount: '20',
            totalPages: '3',
            currentPage: '2',
        } as Params;

        service.enableRacingAssetTypeFalg(queryParams);

        expect(service.isQuadSplittingEnabled).toBeTrue();
        expect(service.splitScreenParams).toEqual({
            startPageIndex: '1',
            endPageIndex: '10',
            maxRunnerCount: '20',
            totalPages: '3',
            currentPage: '2',
        });
        expect(service.isRCEnabled).toBeFalse();
        expect(service.isScrollingEnabled).toBeFalse();
        expect(service.isHalfSplittingEnabled).toBeFalse();
    });

    it('should set maxFixedRunners to 5 and maxViewRunners to 8 for half screen with scrolling enabled and other conditions met', () => {
        service.isHalfSplittingEnabled = true;
        service.isRCEnabled = false;
        service.isScrollingEnabled = true;
        service.isRacingPostVerdictCountries = true;
        service.isDiomedPresent = true;

        const horseRacingRunnersResult = { ...mockData.horceMock, showPostPick: true };

        const result = service.maxFixedViewRunner(horseRacingRunnersResult);

        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });
    it('should correctly split fixed and auto-scroll runners when half-splitting is enabled', () => {
        const mockHorseRacingRunnersResult = {
            horseRacingEntries: Array.from({ length: 40 }, (_, i) => ({ id: i + 1 })), // 40 mock entries
            splitScreenRunnerConfig: {
                half: {
                    options: {
                        splitScreenTemplatesInitialRunner: 20,
                        splitScreenTemplatesScrollEnableAt: 32,
                        splitScreenTemplatesMaxPages: 2,
                        splitScreenTemplateFixedSelections: 5,
                    },
                },
            },
        } as any;

        service.isHalfSplittingEnabled = true;
        service.isQuadSplittingEnabled = false;
        const splitScreenParams: SplitScreenQueryParams = {
            startPageIndex: '1', // Assuming start at index 1
            currentPage: '2', // Last page based on splitScreenTemplatesMaxPages
            endPageIndex: '2', // Example value for end page
            maxRunnerCount: '40', // Assuming max runners in the configuration
            totalPages: '2', // Matching splitScreenTemplatesMaxPages
        };

        service.splitScreenParams = splitScreenParams;

        service.totalRunners = 40;

        // Mock the prepareSplitScreenMaxFixedViewRunner to return fixed runner counts
        spyOn(service, 'prepareSplitScreenMaxFixedViewRunner').and.returnValue({ maxFixedRunners: 5, maxViewRunners: 10 });

        // Act
        const result = service.prepareFixedAndScrollRunners(mockHorseRacingRunnersResult);

        // Assert
        const expectedFixedRunners = mockHorseRacingRunnersResult.horseRacingEntries.slice(0, 5); // From startPageIndex to fixed selection end
        const expectedAutoScrollRunners = mockHorseRacingRunnersResult.horseRacingEntries.slice(5); // Remaining entries after fixed runners

        expect(result.horseRacingFixedRunnersResult).toEqual(expectedFixedRunners);
        expect(result.horseRacingAutoScrollRunnersResult).toEqual(expectedAutoScrollRunners);
        expect(result.horseRacingFixedRunnersResult.length).toBe(5); // Matches fixed selections count
        expect(result.horseRacingAutoScrollRunnersResult.length).toBe(35); // Remaining entries
    });

    it('should enable isHalfSplittingEnabled and set splitScreenParams for halfScreensplitting asset type', () => {
        const queryParams = {
            racingAssetType: 'halfscreensplit',
            startPageIndex: '1',
            endPageIndex: '8',
            maxRunnerCount: '16',
            totalPages: '2',
            currentPage: '1',
        } as Params;

        service.enableRacingAssetTypeFalg(queryParams);

        expect(service.isHalfSplittingEnabled).toBeTrue();
        expect(service.splitScreenParams).toEqual({
            startPageIndex: '1',
            endPageIndex: '8',
            maxRunnerCount: '16',
            totalPages: '2',
            currentPage: '1',
        });
        expect(service.isRCEnabled).toBeFalse();
        expect(service.isScrollingEnabled).toBeFalse();
        expect(service.isQuadSplittingEnabled).toBeFalse();
    });

    it('should keep all entries if all hideEntry values are false', () => {
        const horseRacingEntries = mockData.HorseRacingEntries1.allFalseEntries();
        const filteredEntries = service.removeSuspendedAndHiddenEntries(horseRacingEntries);

        expect(filteredEntries.length).toBe(2);
        expect(filteredEntries).toEqual(horseRacingEntries);
    });

    it('should remove all entries if all hideEntry values are true', () => {
        const horseRacingEntries = mockData.HorseRacingEntries1.allTrueEntries();
        const filteredEntries = service.removeSuspendedAndHiddenEntries(horseRacingEntries);

        expect(filteredEntries.length).toBe(0);
    });

    it('should set rcClass based on getRcTemplate result for half screen and runners length <= 16', () => {
        spyOn(screenTypeService, 'isHalfScreenType').and.returnValue(true);
        service.isRCEnabled = true;

        const horseRacingRunnersResult = mockData.horceMock;

        spyOn(service, 'getRcTemplate').and.callThrough();

        const result = service.maxFixedViewRunner(horseRacingRunnersResult);

        expect(result.maxFixedRunners).toBe(mockData.horceMock.horseRacingEntries.length);
        expect(service.getRcTemplate).toHaveBeenCalledWith(mockData.horceMock.horseRacingEntries.length, horseRacingRunnersResult);
        expect(service.rcClass).toBeDefined();
    });
});
