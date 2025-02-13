import { TestBed } from '@angular/core/testing';

import { RoundBettingService } from './round-betting.service';

describe('RoundBettingService', () => {
    let service: RoundBettingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RoundBettingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
