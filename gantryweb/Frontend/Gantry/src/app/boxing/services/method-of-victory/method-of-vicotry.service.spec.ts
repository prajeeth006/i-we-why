import { TestBed } from '@angular/core/testing';

import { MethodOfVicotryService } from './method-of-vicotry.service';

describe('MethodOfVicotryService', () => {
  let service: MethodOfVicotryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MethodOfVicotryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
