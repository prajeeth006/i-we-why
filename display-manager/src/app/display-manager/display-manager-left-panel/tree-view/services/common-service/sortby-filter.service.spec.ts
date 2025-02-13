import { TestBed } from '@angular/core/testing';

import { SortbyFilterService } from './sortby-filter.service';

describe('SortbyFilterService', () => {
  let service: SortbyFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortbyFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
