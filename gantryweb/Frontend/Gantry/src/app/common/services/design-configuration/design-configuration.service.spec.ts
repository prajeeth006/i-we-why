import { TestBed } from '@angular/core/testing';

import { DesignConfigurationService } from './design-configuration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DesignConfigurationService', () => {
  let service: DesignConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(DesignConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
