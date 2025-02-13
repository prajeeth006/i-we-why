import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GantryMarketsService } from './gantry-markets.service';

describe('GantryMarketsService', () => {
    let service: GantryMarketsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(GantryMarketsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty string when gantryMarkets is null or undefined', () => {
        const resultWithNull = service.hasMarket('football', 'market1', 'match1', null);
        const resultWithUndefined = service.hasMarket('football', 'market1', 'match1', undefined);
        expect(resultWithNull).toBe('');
        expect(resultWithUndefined).toBe('');
    });
});
