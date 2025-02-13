import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CricketCdsCommonService } from './cricket-cds-common.service';

describe('CricketCdsCommonService', () => {
    let service: CricketCdsCommonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CricketCdsCommonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
