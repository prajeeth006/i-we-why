import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AntePostDrawService } from './ante-post-draw.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AntePostDrawService', () => {
  let service: AntePostDrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AntePostDrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(service.prepareAntiPostDrawResult(undefined, undefined, undefined)).not.toBeUndefined();
  });
});
