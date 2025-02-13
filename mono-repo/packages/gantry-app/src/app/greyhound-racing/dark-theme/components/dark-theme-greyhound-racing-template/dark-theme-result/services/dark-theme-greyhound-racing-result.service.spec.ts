import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../../common/mocks/event-feed-url-service.mock';
import { DarkThemeGreyhoundRacingResultService } from './dark-theme-greyhound-racing-result.service';

describe('DarkThemeGreyhoundRacingResultService', () => {
    let service: DarkThemeGreyhoundRacingResultService;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeGreyhoundRacingResultService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
