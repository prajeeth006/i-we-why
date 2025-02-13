import { HttpInterceptorFn } from '@angular/common/http';

import { antiForgeryInterceptor } from './anti-forgery.interceptor';

export function provideHttpInterceptors(): HttpInterceptorFn[] {
    return [antiForgeryInterceptor];
}
