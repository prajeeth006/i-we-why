import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  logoutUrl = '/sitecore/api/ssc/auth/logout';
  cookieName = 'XSRF-TOKEN';
  tokenKey = '__RequestVerificationToken';

  constructor(private httpClient: HttpClient) { }

  logout() {
    var xsrfToken = this.parseCookieValue(document.cookie, this.cookieName);
    var body = new URLSearchParams();
    body.append(this.tokenKey, xsrfToken || '');
    var headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    var options = { headers: headers };
    this.httpClient.post(this.logoutUrl, body.toString(), options)
      .subscribe(this.redirect.bind(this), this.handleLogoutError.bind(this));
  }

  private redirect(response: any) {
    window.location.href = response.Redirect;
  }

  private handleLogoutError(error: any) {
    if (error.status == 404) {
      this.reloadPage();
    }
  }

  private reloadPage() {
    window?.top?.location.reload();
  }

  private parseCookieValue(cookieStr: any, name: any) {
    name = encodeURIComponent(name);
    for (var _i = 0, _a = cookieStr.split(';'); _i < _a.length; _i++) {
      var cookie = _a[_i];
      var eqIndex = cookie.indexOf('=');
      var _b = eqIndex == -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)], cookieName = _b[0], cookieValue = _b[1];
      if (cookieName.trim() === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
}
