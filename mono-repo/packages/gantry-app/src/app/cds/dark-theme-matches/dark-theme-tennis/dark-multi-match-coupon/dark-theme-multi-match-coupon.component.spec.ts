import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { StringHelper } from '../../../../common/helpers/string.helper';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { MockData } from '../../../matches/tennis/mock/mock-multi-match-coupon';
import { HomeAway } from '../../../matches/tennis/models/multi-match-model';
import { DarkThemeMultiMatchCouponComponent } from './dark-theme-multi-match-coupon.component';

describe('DarkThemeMultiMatchCouponComponent', () => {
    let component: DarkThemeMultiMatchCouponComponent;
    let fixture: ComponentFixture<DarkThemeMultiMatchCouponComponent>;
    let homeAway: MockData;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeMultiMatchCouponComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        homeAway = new MockData();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Should sort by date time and selection name', () => {
        StringHelper.sortTennisMultiMatchHomeAwayEvent(homeAway.homeAwayEventResponse);
        homeAway.homeAwayEventResponse.forEach((selection: HomeAway, index: number) => {
            expect(selection?.eventDateTime).toBe(homeAway.homeAwayEventResponse[index]?.eventDateTime);
            expect(selection?.homeSelection?.selectionName).toBe(homeAway.HomeAwaySelectionExpected[index]?.homeSelection?.selectionName);
        });
    });
});
