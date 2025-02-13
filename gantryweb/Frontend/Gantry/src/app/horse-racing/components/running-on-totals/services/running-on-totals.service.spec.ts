import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RunningOnTotalsService } from './running-on-totals.service';

describe('RunningOnTotalsService', () => {
  let service: RunningOnTotalsService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(RunningOnTotalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
