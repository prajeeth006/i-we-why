import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ManualGreyhoundRacingTemplateService } from './../services/manual-greyhound-racing-template.service';
import { ManualResultsComponent } from './manual-results.component';

describe('ManualResultsComponent', () => {
    let component: ManualResultsComponent;
    let fixture: ComponentFixture<ManualResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManualResultsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                ManualGreyhoundRacingTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ManualResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
