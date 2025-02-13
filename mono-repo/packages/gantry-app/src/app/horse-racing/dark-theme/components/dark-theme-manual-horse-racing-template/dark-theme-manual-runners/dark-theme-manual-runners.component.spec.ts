import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeManualHorseRacingTemplateService } from '../services/dark-theme-manual-horse-racing-template.service';
import { DarkThemeManualRunnersComponent } from './dark-theme-manual-runners.component';

describe('DarkThemeManualRunnersComponent', () => {
    let component: DarkThemeManualRunnersComponent;
    let fixture: ComponentFixture<DarkThemeManualRunnersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeManualRunnersComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                DarkThemeManualHorseRacingTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeManualRunnersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
