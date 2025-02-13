import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { ContentItem, DslService } from '@frontend/vanilla/core';
import { ContentMessagesService } from '@frontend/vanilla/features/content-messages';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { OVERLAY_MESSAGES_CONTENT, OverlayMessagesComponent } from './overlay-messages.component';

@Injectable()
export class OverlayMessagesService {
    private contentStream = new ReplaySubject<ContentItem[]>(1);
    private currentRef: OverlayRef | null;

    constructor(
        private overlay: OverlayFactory,
        private injector: Injector,
        private contentMessagesService: ContentMessagesService,
        dslService: DslService,
    ) {
        contentMessagesService.getMessages('messages', 'm2').subscribe((messages) => {
            dslService
                .evaluateContent(messages)
                .pipe(
                    filter((contentItems): contentItems is ContentItem[] => contentItems instanceof Array),
                    map((contentItems: ContentItem[]) => this.filterClosedMessages(contentItems)),
                )
                .subscribe(this.contentStream);
        });
    }

    showOverlayMessages() {
        this.contentStream.subscribe((content: ContentItem[]) => {
            if (content.length && !this.currentRef) {
                const overlayRef = this.overlay.create({
                    panelClass: 'vn-overlay-messages-container',
                    positionStrategy: this.overlay.position.global().centerHorizontally().top(),
                });

                const portal = new ComponentPortal(
                    OverlayMessagesComponent,
                    null,
                    Injector.create({
                        providers: [
                            { provide: OverlayRef, useValue: overlayRef },
                            { provide: OVERLAY_MESSAGES_CONTENT, useValue: this.contentStream.asObservable() },
                        ],
                        parent: this.injector,
                    }),
                );
                overlayRef.attach(portal);

                overlayRef.detachments().subscribe(() => {
                    this.overlay.dispose(this.currentRef);
                    this.currentRef = null;
                });

                this.currentRef = overlayRef;
            } else if (!content.length && this.currentRef) {
                this.overlay.dispose(this.currentRef);
                this.currentRef = null;
            }
        });
    }

    private filterClosedMessages(content: ContentItem[]): ContentItem[] {
        const closedMsgNames = new Set(this.contentMessagesService.getClosedMessageNames('m2').map((v) => v.toLowerCase()));

        return content.filter((m) => m && !closedMsgNames.has(m.name.toLowerCase()));
    }
}
