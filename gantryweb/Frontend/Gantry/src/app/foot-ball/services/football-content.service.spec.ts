import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FootballContentService } from './football-content.service';
import { RouterTestingModule } from "@angular/router/testing";

describe('FootballContentService', () => {
  let service: FootballContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(FootballContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
