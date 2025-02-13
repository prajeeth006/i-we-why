import { TestBed } from '@angular/core/testing';

import { DarkThemeResultService } from './dark-theme-result.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DarkThemeResultService', () => {
  let service: DarkThemeResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(DarkThemeResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
