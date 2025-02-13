import { TestBed } from '@angular/core/testing';

import { WindowHelper } from './window-helper';

describe('WindowHelper', () => {
    let service: WindowHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WindowHelper);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
