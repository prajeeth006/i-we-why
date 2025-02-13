import { TestBed } from '@angular/core/testing';
import { RouteDataService } from './route-data.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouteDataService', () => {
  let service: RouteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Add RouterTestingModule to provide ActivatedRoute
      providers: [RouteDataService], // Ensure the service is provided
    });
    service = TestBed.inject(RouteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

