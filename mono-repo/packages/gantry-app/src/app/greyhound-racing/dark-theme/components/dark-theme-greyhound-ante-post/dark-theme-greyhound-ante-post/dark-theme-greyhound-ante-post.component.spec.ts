import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { GantryCommonModule } from '../../../../../common/gantry-common.module';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { DarkThemeGreyhoundAntePostComponent } from './dark-theme-greyhound-ante-post.component';

describe('DarkThemeGreyhoundAntePostComponent', () => {
    let component: DarkThemeGreyhoundAntePostComponent;
    let fixture: ComponentFixture<DarkThemeGreyhoundAntePostComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeGreyhoundAntePostComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GantryCommonModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeGreyhoundAntePostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
