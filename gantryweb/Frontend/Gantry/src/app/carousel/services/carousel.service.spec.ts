import { TestBed } from '@angular/core/testing';
import { CarouselService } from './carousel.service';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CarouselService', () => {
  let service: CarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(CarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
