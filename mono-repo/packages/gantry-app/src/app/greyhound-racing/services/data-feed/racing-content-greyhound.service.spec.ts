import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { EventSourceDataFeedServiceMock } from '../../../common/mocks/event-source-data-feed-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { RacingContentGreyhoundService } from './racing-content-greyhound.service';

describe('RacingContentGreyhoundService', () => {
    let service: RacingContentGreyhoundService;

    beforeEach(() => {
        MockContext.useMock(EventSourceDataFeedServiceMock);
        MockContext.useMock(RouteDataServiceMock);
        TestBed.configureTestingModule({
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(RacingContentGreyhoundService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
