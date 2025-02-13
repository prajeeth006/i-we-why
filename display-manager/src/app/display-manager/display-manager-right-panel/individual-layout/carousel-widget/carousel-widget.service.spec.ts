import { TestBed } from '@angular/core/testing';

import { CarouselWidgetService } from './carousel-widget.service';

describe('CarouselWidgetService', () => {
  let service: CarouselWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
