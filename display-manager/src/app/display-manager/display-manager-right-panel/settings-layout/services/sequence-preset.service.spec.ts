import { TestBed } from '@angular/core/testing';

import { SequencePresetService } from './sequence-preset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SequencePresetService', () => {
  let service: SequencePresetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SequencePresetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
