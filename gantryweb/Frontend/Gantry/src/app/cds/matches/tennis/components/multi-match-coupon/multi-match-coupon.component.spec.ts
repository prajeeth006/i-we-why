import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMatchCouponComponent } from './multi-match-coupon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { HomeAway } from '../../models/multi-match-model';
import { MockData } from '../../mock/mock-multi-match-coupon';

describe('MultiMatchCouponComponent', () => {
  let component: MultiMatchCouponComponent;
  let fixture: ComponentFixture<MultiMatchCouponComponent>;
  let homeAway: MockData;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [MultiMatchCouponComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MultiMatchCouponComponent);
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
    })

  });

  it('Should match length after filtering selection', () => {
    let data = StringHelper.getTennisMultiMatchActiveSelections(homeAway.homeDrawAwayEvent);
    expect(data.length).toBe(2);
  });

});
