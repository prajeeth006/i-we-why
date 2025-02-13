import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EventSourceDataFeedService } from '../eventfeed-service/event-source-data-feed.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EventSourceDataFeedService', () => {
  let service: EventSourceDataFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EventSourceDataFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

