import { HttpInterceptorFn } from '@angular/common/http';
import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { MessageQueueBootstrapService } from './message-queue-bootstrap.service';
import { messagesInterceptor } from './messages.interceptor';

export function provideMessagesInterceptors(): HttpInterceptorFn[] {
    return [messagesInterceptor];
}

export function provideMessages(): Provider[] {
    return [runOnAppInit(MessageQueueBootstrapService)];
}
