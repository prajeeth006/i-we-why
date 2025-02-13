import { TestBed } from '@angular/core/testing';

import { DarkThemePostPickNbService } from './dark-theme-post-pick-nb.service';

describe('DarkThemePostPickNbService', () => {
    let service: DarkThemePostPickNbService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DarkThemePostPickNbService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
