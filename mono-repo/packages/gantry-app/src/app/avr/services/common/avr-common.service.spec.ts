import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AvrCommonService } from './avr-common.service';

describe('AvrCommonService', () => {
    let service: AvrCommonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(AvrCommonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
