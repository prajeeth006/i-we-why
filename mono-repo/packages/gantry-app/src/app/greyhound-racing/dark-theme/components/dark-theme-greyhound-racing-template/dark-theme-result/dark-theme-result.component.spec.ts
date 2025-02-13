import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { DarkThemeResultComponent } from './dark-theme-result.component';

describe('DarkThemeResultComponent', () => {
    let component: DarkThemeResultComponent;
    let fixture: ComponentFixture<DarkThemeResultComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeResultComponent],
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DarkThemeResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
