import { Injectable, inject, signal } from '@angular/core';

import { ContentItem, DslService } from '@frontend/vanilla/core';
import { ContentMessagesService } from '@frontend/vanilla/features/content-messages';
import { switchMap } from 'rxjs';

export interface HeaderContentItems {
    [key: string]: ContentItem[];
}

@Injectable({ providedIn: 'root' })
export class HeaderMessagesService {
    readonly headerMessages = signal<ContentItem[] | null>(null);
    readonly stickyTopMessages = signal<ContentItem[] | null>(null);

    private readonly contentMessagesService = inject(ContentMessagesService);
    private readonly dslService = inject(DslService);

    init() {
        this.contentMessagesService
            .getMessages('header/topMessages', 'vn-t')
            .pipe(switchMap((messages: ContentItem[] | HeaderContentItems) => this.dslService.evaluateContent(messages)))
            .subscribe((messages: ContentItem[] | HeaderContentItems) => {
                this.headerMessages.update(() => this.getMessages(messages));
            });

        this.contentMessagesService
            .getMessages('header/stickyTopMessages', 'vn-ts')
            .pipe(switchMap((messages: ContentItem[] | HeaderContentItems) => this.dslService.evaluateContent(messages)))
            .subscribe((messages: ContentItem[] | HeaderContentItems) => {
                this.stickyTopMessages.update(() => this.getMessages(messages));
            });
    }

    getMessages(messages: ContentItem[] | HeaderContentItems): ContentItem[] {
        if (Array.isArray(messages)) {
            return messages;
        }
        return Object.values(messages).flat();
    }
}
