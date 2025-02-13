import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DefaultImageService } from './default-image.service';
import { MockContext } from 'moxxi';

describe('DefaultImageService', () => {
  let service: DefaultImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [MockContext.providers, HttpClientTestingModule]
    });
    service = TestBed.inject(DefaultImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
