import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { SportEventDateFormatPipe } from '../../../common/pipes/sport-event-datetime-format.pipe';
import { DarkThemeTennisCdsComponent } from './dark-theme-tennis-cds.component';

describe('DarkThemeTennisCdsComponent', () => {
    let component: DarkThemeTennisCdsComponent;
    let fixture: ComponentFixture<DarkThemeTennisCdsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeTennisCdsComponent, SportEventDateFormatPipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeTennisCdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
