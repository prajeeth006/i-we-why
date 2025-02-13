import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { HorseRacingRunnersResult, MaxFixedViewrRunner } from '../../../../models/horse-racing-template.model';
import { MockDarkThemHorseRacingResultsData } from '../mocks/mock-dark-theme-horse-racing-results-data';
import { DarkThemeRunnersComponent } from './dark-theme-runners.component';

describe('DarkThemeRunnersComponent', () => {
    let component: DarkThemeRunnersComponent;
    let fixture: ComponentFixture<DarkThemeRunnersComponent>;
    let mockData: MockDarkThemHorseRacingResultsData;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeRunnersComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeRunnersComponent);
        component = fixture.componentInstance;
        mockData = new MockDarkThemHorseRacingResultsData();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('when maxFixedViewRunner with not null parameters called the result should not be null', () => {
        const result = component.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result).not.toBeNull();
    });

    it('when screen type is half, Fixed and Viewer runner count should be correct', () => {
        component.screenType = 'half';
        const result: MaxFixedViewrRunner = component.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(7);
        expect(result.maxViewRunners).toBe(10);
    });

    it('when screen type is full, Fixed and Viewer runner count should be correct', () => {
        component.screenType = 'full';
        const result: MaxFixedViewrRunner = component.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is quad, Fixed and Viewer runner count should be correct', () => {
        component.screenType = 'quad';
        const result: MaxFixedViewrRunner = component.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });

    it('when screen type is undefined, Fixed and Viewer runner count should be correct', () => {
        const result: MaxFixedViewrRunner = component.maxFixedViewRunner(mockData as HorseRacingRunnersResult);
        expect(result.maxFixedRunners).toBe(5);
        expect(result.maxViewRunners).toBe(8);
    });
});
