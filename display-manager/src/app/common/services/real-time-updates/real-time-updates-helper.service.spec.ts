import { TestBed } from '@angular/core/testing';
import { RealTimeUpdatesHelperService } from './real-time-updates-helper.service';
import { BehaviorSubject } from 'rxjs';

describe('RealTimeUpdatesHelperService', () => {
  let service: RealTimeUpdatesHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealTimeUpdatesHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset master layout touched status', () => {
    service.isMasterScreensTouched$.next(true);
    service.isProfileDropdownTouched$.next(true);

    const isMasterScreensTouchedSpy = spyOn(service.isMasterScreensTouched$, 'next');
    const isProfileDropdownTouchedSpy = spyOn(service.isProfileDropdownTouched$, 'next');
    service.resetMasterLayoutTouchedStatus();
  });
});
