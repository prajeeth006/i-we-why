import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { AvrDataFeedServiceMock } from '../../common/mocks/avr-data-feed-service.mock';
//import { AvrService } from './avr.service';
//import { of } from 'rxjs';

describe('AvrService', () => {
  //let service: AvrService;
  // let serviceSpy = jasmine.createSpyObj('AvrDataFeedService', {
  //   'avrService$': of('mock data'),
  //   'other': 'some val'
  // });
  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    MockContext.useMock(AvrDataFeedServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });

    //service = TestBed.inject(AvrService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});