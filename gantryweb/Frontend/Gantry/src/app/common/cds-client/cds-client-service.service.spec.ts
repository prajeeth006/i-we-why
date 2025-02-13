import { TestBed } from '@angular/core/testing';
import { CdsClientService } from './cds-client-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CdsClientService', () => {
  let service: CdsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(CdsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
