import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { QueryParamsService } from './query-params.service';

describe('QueryParamsService', () => {
    let service: QueryParamsService;
    const url = 'https://domain.com/route-path';
    const params = { key1: 'value1', key2: 'value2', key3: 'value3' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(QueryParamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add query parameters to the url', () => {
        const finalUrl = service.addParams(url, params);
        expect(finalUrl).toBe('https://domain.com/route-path?key1=value1&key2=value2&key3=value3');
    });

    it('should return same url if no query parameters available', () => {
        const params = {}; // no queryparams
        const finalUrl = service.addParams(url, params);
        expect(finalUrl).toBe('https://domain.com/route-path');
    });
});
