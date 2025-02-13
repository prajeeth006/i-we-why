import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeCricketCdsComponent } from './dark-theme-cricket-cds.component';

describe('DarkThemeCricketCdsComponent', () => {
    let component: DarkThemeCricketCdsComponent;
    let fixture: ComponentFixture<DarkThemeCricketCdsComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeCricketCdsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeCricketCdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
