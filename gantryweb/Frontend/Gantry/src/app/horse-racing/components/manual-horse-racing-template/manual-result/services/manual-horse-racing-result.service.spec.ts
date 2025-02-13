import { TestBed } from '@angular/core/testing';

import { ManualHorseRacingResultService } from './manual-horse-racing-result.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { RouterTestingModule } from '@angular/router/testing';
import { ManualHorseRacingTemplateService } from '../../services/manual-horse-racing-template.service';
import {ManualHorseRacingTemplateResult} from '../../../../models/horse-racing-manual-template.model';
import { MOCK_MANUAL_HORSE_RACING } from '../../mocks/mock-manual-horse-racing-data';

describe('ManualHorseRacingResultService', () => {
  let service: ManualHorseRacingResultService;
  let racingContent: ManualHorseRacingTemplateResult;
  beforeEach(() => {
    TestBed.configureTestingModule({    
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers, ManualHorseRacingTemplateService],
    });
    service = TestBed.inject(ManualHorseRacingResultService);
    racingContent = MOCK_MANUAL_HORSE_RACING;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it("non-runner data ", () => {
    expect(service.prepareNonRunners(racingContent.Runners)
    ).toBe('2');
  });
});
