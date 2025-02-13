import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private router: Router,
    private authenticationService: AuthService
) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authenticationService.hasPageAccessPermission().pipe(map(isAuthorized => {
        if (!isAuthorized) {
          this.router.navigate(['/Unauthorized']);
        }
        return isAuthorized;
    }));
  }
}
