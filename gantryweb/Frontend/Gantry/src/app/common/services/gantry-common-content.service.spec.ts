import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GantryCommonContentService } from './gantry-common-content.service';

describe('GantryCommonContentService', () => {
  let service: GantryCommonContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(GantryCommonContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
