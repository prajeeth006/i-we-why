import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { CommonResultsServiceMock } from '../../../mocks/common-results-service.mock';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';
import { MeetingResultsService } from './meeting-results.service';

describe('MeetingResultsService', () => {
    let service: MeetingResultsService;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(CommonResultsServiceMock);

        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(MeetingResultsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
