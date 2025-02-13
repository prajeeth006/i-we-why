import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { RouteDataServiceMock } from '../mocks/route-data-service.mock';
import { SignalrService } from './signalr.service';

describe('SignalrService', () => {
    let service: SignalrService;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi())],
        });
        service = TestBed.inject(SignalrService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
