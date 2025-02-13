import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { SportEventDateFormatPipe } from '../../../../../common/pipes/sport-event-datetime-format.pipe';
import { DarkThemeMatchBettingComponent } from './dark-theme-match-betting.component';

describe('DarkThemeMatchBettingComponent', () => {
    let component: DarkThemeMatchBettingComponent;
    let fixture: ComponentFixture<DarkThemeMatchBettingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeMatchBettingComponent, SportEventDateFormatPipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeMatchBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
