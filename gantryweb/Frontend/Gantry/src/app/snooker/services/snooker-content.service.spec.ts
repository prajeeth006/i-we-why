import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SnookerContentService } from './snooker-content.service';

describe('SnookerContentService', () => {
  let service: SnookerContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(SnookerContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
