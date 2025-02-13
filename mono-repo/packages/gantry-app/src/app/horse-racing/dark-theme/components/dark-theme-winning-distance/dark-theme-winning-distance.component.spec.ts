import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { EventFeedUrlService } from '../../../../common/services/event-feed-url.service';
import { NonRunnersService } from '../../../services/data-feed/non-runners.service';
import { DarkThemeWinningDistanceComponent } from './dark-theme-winning-distance.component';

describe('DarkThemeWinningDistanceComponent', () => {
    let component: DarkThemeWinningDistanceComponent;
    let fixture: ComponentFixture<DarkThemeWinningDistanceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeWinningDistanceComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                NonRunnersService,
                EventFeedUrlService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(DarkThemeWinningDistanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
