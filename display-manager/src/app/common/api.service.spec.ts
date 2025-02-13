import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ProgressService } from './progress-service/progress.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let progressService: jasmine.SpyObj<ProgressService>;

  beforeEach(() => {
    progressService = jasmine.createSpyObj('ProgressService', ['start', 'done']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: ProgressService, useValue: progressService },
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request and call progress.done()', () => {
    const mockResponse = { data: 'test' };
    const url = 'http://example.com/data';

    service.get(url).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(progressService.done).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should make a POST request and call progress.done()', () => {
    const mockResponse = { success: true };
    const url = 'http://example.com/data';
    const body = { key: 'value' };

    service.post(url, body).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(progressService.done).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('should make a DELETE request and call progress.done()', () => {
    const mockResponse = { success: true };
    const url = 'http://example.com/data';

    service.delete(url).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(progressService.done).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should handle errors in DELETE request and call progress.done()', () => {
    const url = 'http://example.com/data';
    const errorMessage = 'Error occurred';

    service.delete(url).subscribe({
      next: () => fail('expected an error, not data'),
      error: (error) => {
        expect(progressService.done).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
