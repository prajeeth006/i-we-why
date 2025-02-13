import { HttpInterceptorFn } from '@angular/common/http';
import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { httpErrorInterceptor } from './http-interceptors/http-error.interceptor';
import { rememberMeLoginHttpInterceptor } from './http-interceptors/remember-me-login.http-interceptor';
import { rememberMeLogoutHttpInterceptor } from './http-interceptors/remember-me-logout.http-interceptor';
import { RememberMeBootstrapService } from './remember-me-bootstrap.service';

export function provideLogin(): Provider[] {
    return [runOnAppInit(RememberMeBootstrapService)];
}

export function provideLoginInterceptors(): HttpInterceptorFn[] {
    // httpErrorInterceptor must process response after remember-me otherwise we would get redirected
    return [httpErrorInterceptor, rememberMeLoginHttpInterceptor, rememberMeLogoutHttpInterceptor];
}
