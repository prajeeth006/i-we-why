import { TestBed } from '@angular/core/testing';

import { MasterConfigurationService } from './master-configuration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MasterConfigurationService', () => {
  let service: MasterConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add HttpClientTestingModule to mock HTTP requests
      providers: [MasterConfigurationService], // Provide the service
    });
    service = TestBed.inject(MasterConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
