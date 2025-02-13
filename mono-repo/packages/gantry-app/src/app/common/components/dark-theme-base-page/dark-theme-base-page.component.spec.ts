import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../mocks/route-data-service.mock';
import { DarkThemeBasePageComponent } from './dark-theme-base-page.component';

describe('DarkThemeBasePageComponent', () => {
    let component: DarkThemeBasePageComponent;
    let fixture: ComponentFixture<DarkThemeBasePageComponent>;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeBasePageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeBasePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
