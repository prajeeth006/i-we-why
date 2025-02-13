import { TestBed } from '@angular/core/testing';

import { ManualFormService } from './manual-form.service';

describe('ManualFormService', () => {
  let service: ManualFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
