import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../mocks/route-data-service.mock';
import { EventDatetimeChangeformatPipe } from '../../pipes/event-datetime.changeformat.pipe';
import { DarkThemeHeaderComponent } from './dark-theme-header.component';

describe('DarkThemeHeaderComponent', () => {
    let component: DarkThemeHeaderComponent;
    let fixture: ComponentFixture<DarkThemeHeaderComponent>;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            declarations: [DarkThemeHeaderComponent, EventDatetimeChangeformatPipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
