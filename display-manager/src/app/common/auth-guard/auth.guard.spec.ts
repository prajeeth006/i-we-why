import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['hasPageAccessPermission']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is authorized', (done) => {
    authServiceMock.hasPageAccessPermission.and.returnValue(of(true));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(result).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should navigate to /Unauthorized if user is not authorized', (done) => {
    authServiceMock.hasPageAccessPermission.and.returnValue(of(false));

    guard.canActivate({} as any, {} as any).subscribe((result) => {
      expect(result).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/Unauthorized']);
      done();
    });
  });

  it('should handle observable errors gracefully', (done) => {
    authServiceMock.hasPageAccessPermission.and.returnValue(of(false));

    guard.canActivate({} as any, {} as any).subscribe({
      next: (result) => {
        expect(result).toBeFalse();
        done();
      },
      error: (err) => {
        fail('should not throw error: ' + err);
        done();
      },
    });
  });
});
