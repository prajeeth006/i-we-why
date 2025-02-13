import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { GantryCommonModule } from '../../../../../common/gantry-common.module';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { DarkThemeHorseAntePostComponent } from './dark-theme-horse-ante-post.component';

describe('DarkThemeHorseAntePostComponent', () => {
    let component: DarkThemeHorseAntePostComponent;
    let fixture: ComponentFixture<DarkThemeHorseAntePostComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeHorseAntePostComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GantryCommonModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeHorseAntePostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
