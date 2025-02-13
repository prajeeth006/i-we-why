import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MultiviewService } from './multiview.service';
import { RouterTestingModule } from "@angular/router/testing";

describe('MultiviewService', () => {
  let service: MultiviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(MultiviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
