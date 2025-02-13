import { TestBed } from '@angular/core/testing';

import { SportContentService } from './sport-content.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";

describe('SportContentService', () => {
  let service: SportContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(SportContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
