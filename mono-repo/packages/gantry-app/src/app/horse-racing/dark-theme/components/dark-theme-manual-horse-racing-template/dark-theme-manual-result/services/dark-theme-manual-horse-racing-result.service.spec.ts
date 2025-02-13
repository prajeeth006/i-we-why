import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ManualHorseRacingTemplateResult } from '../../../../../models/horse-racing-manual-template.model';
import { MOCK_MANUAL_HORSE_RACING } from '../../mocks/dark-theme-mock-manual-horse-racing-data';
import { DarkThemeManualHorseRacingTemplateService } from '../../services/dark-theme-manual-horse-racing-template.service';
import { DarkThemeManualHorseRacingResultService } from './dark-theme-manual-horse-racing-result.service';

describe('ManualHorseRacingResultService', () => {
    let service: DarkThemeManualHorseRacingResultService;
    let racingContent: ManualHorseRacingTemplateResult;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                DarkThemeManualHorseRacingTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DarkThemeManualHorseRacingResultService);
        racingContent = MOCK_MANUAL_HORSE_RACING;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('non-runner data ', () => {
        expect(service.prepareNonRunners(racingContent.Runners)).toBe('2');
    });
});
