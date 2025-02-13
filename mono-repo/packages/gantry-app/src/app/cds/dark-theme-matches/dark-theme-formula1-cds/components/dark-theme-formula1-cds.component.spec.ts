import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { SportEventDateFormatPipe } from '../../../../common/pipes/sport-event-datetime-format.pipe';
import { DarkThemeFormula1CdsComponent } from './dark-theme-formula1-cds.component';

describe('DarkThemeFormula1CdsComponent', () => {
    let component: DarkThemeFormula1CdsComponent;
    let fixture: ComponentFixture<DarkThemeFormula1CdsComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeFormula1CdsComponent, SportEventDateFormatPipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(DarkThemeFormula1CdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
