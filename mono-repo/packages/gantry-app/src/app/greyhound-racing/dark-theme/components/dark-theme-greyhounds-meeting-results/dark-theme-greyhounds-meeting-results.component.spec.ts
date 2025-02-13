import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { DarkThemeGreyhoundsMeetingResultsComponent } from './dark-theme-greyhounds-meeting-results.component';

describe('DarkThemeGreyhoundsMeetingResultsComponent', () => {
    let component: DarkThemeGreyhoundsMeetingResultsComponent;
    let fixture: ComponentFixture<DarkThemeGreyhoundsMeetingResultsComponent>;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeGreyhoundsMeetingResultsComponent],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeGreyhoundsMeetingResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
