import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { SportEventDateFormatPipe } from '../../../common/pipes/sport-event-datetime-format.pipe';
import { TitleCaseExceptPipePipe } from '../../../common/pipes/title-case-except-pipe.pipe';
import { DarkThemeFootBallCdsTemplateComponent } from './dark-theme-foot-ball-cds-template.component';

describe('DarkThemeFootBallCdsTemplateComponent', () => {
    let component: DarkThemeFootBallCdsTemplateComponent;
    let fixture: ComponentFixture<DarkThemeFootBallCdsTemplateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeFootBallCdsTemplateComponent, SportEventDateFormatPipe, TitleCaseExceptPipePipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeFootBallCdsTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
