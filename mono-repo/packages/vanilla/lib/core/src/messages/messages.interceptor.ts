import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { shouldInterceptResponse } from '../http/utils';
import { MessageQueueService } from '../messages/message-queue.service';
import { Message } from '../messages/message.models';

export function messagesInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const messageQueueService = inject(MessageQueueService);
    const MessagesScopeHeader = 'X-van-message-queue-scope';

    const messagesScope = req.headers.get(MessagesScopeHeader) || '';
    const headers = req.headers.delete(MessagesScopeHeader);
    const request = req.clone({ headers });

    return next(request).pipe(
        tap(
            (event: HttpEvent<any>) => {
                if (shouldInterceptResponse(event) && event instanceof HttpResponse && event.body?.vnMessages) {
                    addMessages(messageQueueService, event.body.vnMessages, messagesScope);
                }
            },
            (error: any) => {
                if (shouldInterceptResponse(error) && error instanceof HttpErrorResponse && error.error?.vnMessages) {
                    addMessages(messageQueueService, error.error.vnMessages, messagesScope);
                }
            },
        ),
    );
}

function addMessages(messageQueueService: MessageQueueService, messages: Message[], scope: string) {
    messageQueueService.clear();
    messageQueueService.addMultiple(
        messages.map((message: Message) => ({
            ...message,
            scope: scope || message.scope,
        })),
    );
}
