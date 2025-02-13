import { TestBed } from '@angular/core/testing';

import { DarkThemeRunnersService } from './dark-theme-runners.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DarkThemeRunnersService', () => {
  let service: DarkThemeRunnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(DarkThemeRunnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
