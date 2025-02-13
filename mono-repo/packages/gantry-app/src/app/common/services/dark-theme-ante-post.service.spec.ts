import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../mocks/activated-route.mock';
import { RouteDataServiceMock } from '../mocks/route-data-service.mock';
import { DarkThemeAntePostService } from './dark-theme-ante-post.service';

describe('DarkThemeAntePostService', () => {
    let service: DarkThemeAntePostService;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, DarkThemeAntePostService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeAntePostService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
