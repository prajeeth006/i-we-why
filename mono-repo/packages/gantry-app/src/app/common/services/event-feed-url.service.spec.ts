import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Mock, MockContext } from 'moxxi';

import { EventFeedUrlService } from './event-feed-url.service';

describe('HorseRacingService', () => {
    let service: EventFeedUrlService;

    beforeEach(() => {
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(EventFeedUrlService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

@Mock({ of: ActivatedRoute })
class ActivatedRouteMock {}
