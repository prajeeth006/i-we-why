import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../mocks/activated-route.mock';
import { RouteDataServiceMock } from '../../mocks/route-data-service.mock';
import { SportBookService } from './sport-book.service';

describe('SportBookServiceService', () => {
    let service: SportBookService;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(SportBookService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
