import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { MultieventService } from './multievent.service';

describe('MultieventService', () => {
  let service: MultieventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add HttpClientTestingModule here
      providers: [MultieventService] // Ensure the service is provided
    });
    service = TestBed.inject(MultieventService); // Inject the service for testing
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Test if the service is created successfully
  });
});
