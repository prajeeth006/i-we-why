import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeManualHorseRacingTemplateService } from '../services/dark-theme-manual-horse-racing-template.service';
import { DarkThemeManualResultComponent } from './dark-theme-manual-result.component';

describe('DarkThemeManualResultComponent', () => {
    let component: DarkThemeManualResultComponent;
    let fixture: ComponentFixture<DarkThemeManualResultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeManualResultComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                DarkThemeManualHorseRacingTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeManualResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
