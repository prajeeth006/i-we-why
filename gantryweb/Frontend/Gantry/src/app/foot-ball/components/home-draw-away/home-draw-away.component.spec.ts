import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { Mock1 } from '../../mocks/mock-home-draw-away';
import { HomeDrawAwayComponent } from './home-draw-away.component';
import { HomeDrawAway } from './models/home-draw-away.model';
import { StringHelper } from '../../../common/helpers/string.helper';


describe('HomeDrawAwayComponent', () => {
  let component: HomeDrawAwayComponent;
  let fixture: ComponentFixture<HomeDrawAwayComponent>;
  let homeDrawAway: Mock1;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HomeDrawAwayComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDrawAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    homeDrawAway = new Mock1();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should sort by date time and selection name', () => {
    StringHelper.sortHomeDrawAwayEvent(homeDrawAway.HomeDrawAwaySelectionResponse);
    homeDrawAway.HomeDrawAwaySelectionResponse.forEach((selection: HomeDrawAway, index: number) => {
    expect(selection?.eventDateTime).toBe(homeDrawAway.HomeDrawAwaySelectionResponse[index]?.eventDateTime);
    expect(selection?.homeSelection?.selectionName).toBe(homeDrawAway.HomeDrawAwaySelectionExpected[index]?.homeSelection?.selectionName);
    })

  });

  it('Should match length after filtering selection having hideEntry', () => {
    let data = StringHelper.getActiveSelections(homeDrawAway.homeDrawAwayEvent);
    expect(data.length).toBe(5);
  });

});
