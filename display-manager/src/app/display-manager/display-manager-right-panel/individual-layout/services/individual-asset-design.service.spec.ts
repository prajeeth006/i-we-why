import { TestBed } from '@angular/core/testing';

import { IndividualAssetDesignService } from './individual-asset-design.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IndividualAssetDesignService', () => {
  let service: IndividualAssetDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
          });
    service = TestBed.inject(IndividualAssetDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
