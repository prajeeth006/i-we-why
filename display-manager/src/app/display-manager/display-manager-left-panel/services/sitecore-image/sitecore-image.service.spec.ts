import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { SitecoreImageService, SitecoreImages, SitecoreMedia } from './sitecore-image.service';
import { ApiService } from 'src/app/common/api.service';
import { of } from 'rxjs';

describe('SitecoreImageService', () => {
  let service: SitecoreImageService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);
    spy.get.and.returnValue(of([])); 

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for mocking HTTP calls
      providers: [
        SitecoreImageService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(SitecoreImageService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and process Sitecore media assets correctly', () => {
    const mockMediaAssets: SitecoreMedia[] = [
      { name: 'image1', path: '/assets/image1.jpg' },
      { name: 'image2', path: '/assets/image2.jpg' }
    ];
    const expectedImages: SitecoreImages = {
      image1: '/assets/image1.jpg',
      image2: '/assets/image2.jpg'
    };

    apiServiceSpy.get.and.returnValue(of(mockMediaAssets));

    service.getSiteCoreMediaAssets();

    service.mediaAssets$.subscribe((images) => {
      expect(images).toEqual(expectedImages);
    });
  });

  it('should handle empty media assets gracefully', () => {
    apiServiceSpy.get.and.returnValue(of([]));

    service.getSiteCoreMediaAssets();

    service.mediaAssets$.subscribe((images) => {
      expect(images).toEqual({});
    });
  });
});
