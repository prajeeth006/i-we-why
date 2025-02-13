import { TestBed } from '@angular/core/testing';
import { HomeDrawAwayService } from './home-draw-away.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { RouterTestingModule } from '@angular/router/testing';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { HomeDrawAway, HomeDrawAwaySelection } from  '../models/home-draw-away-content.model';

describe('HomeDrawAwayService', () => {
  let service: HomeDrawAwayService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(HomeDrawAwayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('HomeDrawAway with multiple Selections having same EventDateTime', ()=>
  {  let homeDrawAway: HomeDrawAway[] = [
      {
      eventName:'',
      eventDateTime : new Date('2022-12-29T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     },
     {
      eventName:'',
      eventDateTime : new Date('2022-12-30T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     }
  ];
  let eventTimeInfo : string ='{0}';

  let getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway,eventTimeInfo,null);
    expect(getEventTimeDateFromPipe).
    toBe('THURSDAY 29 DECEMBER - FRIDAY 30 DECEMBER');
  });

  it('HomeDrawAway with Multiple Selection with same Event Date Time for different year/month', ()=>
  {
    let homeDrawAway: HomeDrawAway[] = [
      {
      eventName:'',
      eventDateTime : new Date('2022-12-29T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     },
     {
      eventName:'',
      eventDateTime : new Date('2022-11-29T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     }
  ];
  let eventTimeInfo : string ='{0}';

  let getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway,eventTimeInfo,null);
    expect(getEventTimeDateFromPipe).
    toBe('THURSDAY 29 DECEMBER - TUESDAY 29 NOVEMBER');
  });

  it('HomeDrawAway with multiple Selections having same EventDateTime', ()=>
  {
    let homeDrawAway: HomeDrawAway[] = [
      {
      eventName:'',
      eventDateTime : new Date('2022-12-29T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     },
     {
      eventName:'',
      eventDateTime : new Date('2022-12-29T15:00:00Z'),
      eventTime :'',
      homeSelection: new HomeDrawAwaySelection(),
      drawSelection:new HomeDrawAwaySelection(),
      awaySelection:new HomeDrawAwaySelection()
     }
  ];
  let eventTimeInfo : string ='{0}';

  let getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway,eventTimeInfo,null);
    expect(getEventTimeDateFromPipe).toBe('THURSDAY 29 DECEMBER');
  });
});
