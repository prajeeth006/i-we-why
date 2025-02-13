import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { RaceStagePipe } from '../../../../../common/pipes/race-stage.pipe';
import { DarkThemeRaceStageComponent } from './dark-theme-race-stage.component';

describe('DarkThemeRaceStageComponent', () => {
    let component: DarkThemeRaceStageComponent;
    let fixture: ComponentFixture<DarkThemeRaceStageComponent>;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeRaceStageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [MockContext.providers, RaceStagePipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeRaceStageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
