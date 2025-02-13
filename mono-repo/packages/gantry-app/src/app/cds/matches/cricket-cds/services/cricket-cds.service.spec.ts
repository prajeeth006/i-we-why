import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { CricketCdsService } from './cricket-cds.service';

describe('CricketCdsService', () => {
    let service: CricketCdsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [MockContext.providers],
        });
        service = TestBed.inject(CricketCdsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
