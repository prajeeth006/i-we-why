import { TestBed } from '@angular/core/testing';

import { ScreenTypeService } from './screen-type.service';

describe('ScreenTypeService', () => {
    let service: ScreenTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ScreenTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('to set screenType half', () => {
        const screenType = 'half';
        expect(service.setScreenType(screenType));
    });

    it('to set screenType quad', () => {
        const screenType = 'quad';
        expect(service.setScreenType(screenType));
    });

    it('to set screenType full', () => {
        const screenType = 'full';
        expect(service.setScreenType(screenType));
    });
});
