import { TestBed } from '@angular/core/testing';

import { DarkThemeTrapChallengeTemplateService } from './dark-theme-trap-challenge-template.service';

describe('DarkThemeTrapChallengeTemplateService', () => {
    let service: DarkThemeTrapChallengeTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DarkThemeTrapChallengeTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
