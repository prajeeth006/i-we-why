import { TestBed } from '@angular/core/testing';

import { SignalRService } from './signal-r.service';
import { HttpClientModule } from '@angular/common/http';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
