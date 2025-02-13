import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { DarkThemeGreyhoundRacingTemplateComponent } from './dark-theme-greyhound-racing-template.component';

describe('DarkThemeGreyhoundRacingTemplateComponent', () => {
    let component: DarkThemeGreyhoundRacingTemplateComponent;
    let fixture: ComponentFixture<DarkThemeGreyhoundRacingTemplateComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeGreyhoundRacingTemplateComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DarkThemeGreyhoundRacingTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
