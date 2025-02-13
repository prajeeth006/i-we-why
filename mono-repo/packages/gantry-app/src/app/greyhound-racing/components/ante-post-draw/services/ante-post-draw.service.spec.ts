import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AntePostDrawService } from './ante-post-draw.service';

describe('AntePostDrawService', () => {
    let service: AntePostDrawService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(AntePostDrawService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("Page shouldn't broke because of unexpected DF data", () => {
        expect(service.prepareAntiPostDrawResult(undefined, undefined, undefined)).not.toBeUndefined();
    });
});
