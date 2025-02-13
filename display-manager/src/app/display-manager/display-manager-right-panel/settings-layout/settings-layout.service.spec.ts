import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SettingsLayoutService } from './settings-layout.service';
import { ApiService } from 'src/app/common/api.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('SettingsLayoutService', () => {
  let service: SettingsLayoutService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    // Create a spy object for ApiService
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);

    // Spy on the setScreenSettingType method to check if it's called
    spyOn(SettingsLayoutService.prototype, 'setScreenSettingType').and.callThrough();

    // Configure TestBed with the mock ApiService
    TestBed.configureTestingModule({
      providers: [
        SettingsLayoutService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    // Inject the service from TestBed
    service = TestBed.inject(SettingsLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('screenSettingType$', () => {
    it('should return the current screen setting type as an observable', () => {
      const mockValue = 'Scrolling';
      service.setScreenSettingType(mockValue);

      // Subscribe to the observable and check the emitted value
      service.screenSettingType$.subscribe(value => {
        expect(value).toBe(mockValue);
      });
    });
  });

  describe('getscreenSettingType', () => {
    it('should call apiService.get and set the screen setting type when successful', fakeAsync(() => {
      const mockLabel = 'Coral';
      const mockScreenSettingType = 'Scrolling';

      service.currentLabel = mockLabel;
      apiServiceSpy.get.and.returnValue(of(mockScreenSettingType));  // Mock the return value of get()
      service.getscreenSettingType();
      tick();
      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        '/sitecore/api/displayManager/getScreenSettingType',
        jasmine.any(HttpParams)
      );
      expect(service.setScreenSettingType).toHaveBeenCalledWith(mockScreenSettingType);
    }));
  });

  describe('savescreenSettingType', () => {
    it('should call apiService.post and update the screen setting type when successful', fakeAsync(() => {
      const oldType = 'Scrolling';
      const newType = 'Runner Count';
      const mockResponse = '';

      service.currentLabel = 'Coral';
      apiServiceSpy.post.and.returnValue(of(mockResponse));
      service.savescreenSettingType(oldType, newType);
      tick();
      expect(service.setScreenSettingType).toHaveBeenCalledWith(newType);
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        '/sitecore/api/displayManager/saveScreenSettingType',
        jasmine.any(Object),
        jasmine.any(HttpParams)
      );
    }));

    it('should handle errors and revert to the old type if there is an error', fakeAsync(() => {
      const oldType = 'Scrolling';
      const newType = 'Runner Count';
      service.currentLabel = 'Coral';
      apiServiceSpy.post.and.returnValue(throwError('Error'));
      service.savescreenSettingType(oldType, newType);
      tick();
      expect(service.setScreenSettingType).toHaveBeenCalledWith(oldType);
    }));

    it('should emit a default value initially (startWith)', fakeAsync(() => {
      const oldType = 'Scrolling';
      const newType = 'Runner Count';

      service.currentLabel = 'Coral';
      apiServiceSpy.post.and.returnValue(of('success'));
      service.savescreenSettingType(oldType, newType);
      tick();
      expect(service.setScreenSettingType).toHaveBeenCalledWith(oldType);
    }));

    it('should update BehaviorSubject value when setScreenSettingType is called', () => {
      const mockValue = 'Runner Count';
      service.setScreenSettingType(mockValue);
      service.screenSettingType$.subscribe(value => {
        expect(value).toBe(mockValue);
      });
    });
  });
});
