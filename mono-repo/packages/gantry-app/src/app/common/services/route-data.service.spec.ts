import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../mocks/activated-route.mock';
import { RouteDataService } from './route-data.service';

describe('RouteDataService', () => {
    let service: RouteDataService;

    beforeEach(() => {
        MockContext.useMock(ActivatedRouteMock);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi())],
        });
        service = TestBed.inject(RouteDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
