import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { AvrDataFeedServiceMock } from '../../../../common/mocks/avr-data-feed-service.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { DarkThemeAvrPreambleComponent } from './dark-theme-avr-preamble.component';

describe('DarkThemeAvrPreambleComponent', () => {
    let component: DarkThemeAvrPreambleComponent;
    let fixture: ComponentFixture<DarkThemeAvrPreambleComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        MockContext.useMock(AvrDataFeedServiceMock);
        await TestBed.configureTestingModule({
            declarations: [DarkThemeAvrPreambleComponent],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DarkThemeAvrPreambleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
