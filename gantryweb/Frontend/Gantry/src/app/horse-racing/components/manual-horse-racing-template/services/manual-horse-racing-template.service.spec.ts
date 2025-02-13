import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManualHorseRacingTemplateService } from './manual-horse-racing-template.service';
import { MockContext } from 'moxxi';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManualHorseRacingTemplateService', () => {
  let service: ManualHorseRacingTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers],
    });
    service = TestBed.inject(ManualHorseRacingTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 10 if oddsprice is "10/1"', () => {
    expect(service.calculatedPrice("10/1")).toBe(10);
  });

  it('should return 10 if oddsprice is "10/"', () => {
    expect(service.calculatedPrice("10/")).toBe(10);
  });

  it('should return 10 if oddsprice is "10"', () => {
    expect(service.calculatedPrice("10")).toBe(10);
  });

});
