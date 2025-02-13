import { TestBed } from '@angular/core/testing';

import { CarouselContentService } from './carousel-content.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/app/common/api.service';

describe('CarouselContentService', () => {
  let service: CarouselContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarouselContentService, ApiService],
    });
    service = TestBed.inject(CarouselContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
