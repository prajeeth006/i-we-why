import { TestBed } from '@angular/core/testing';

import { ProductTabService } from './product-tab.service';

describe('ProductTabService', () => {
  let service: ProductTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
