import { TestBed } from '@angular/core/testing';

import { DeletenodeService } from './deletenode.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/app/common/api.service';

describe('DeletenodeService', () => {
  let service: DeletenodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Add HttpClientTestingModule here
      providers: [ApiService]
    });
    service = TestBed.inject(DeletenodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
