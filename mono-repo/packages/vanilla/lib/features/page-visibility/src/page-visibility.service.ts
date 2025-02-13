import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageVisibilityService {
    private readonly _doc = inject(DOCUMENT);
    private documentProperties = this.getDocumentProperties();
    private visibilityStream = new BehaviorSubject<{ isVisible: boolean; pageHiddenDuration?: number | undefined }>({
        isVisible: this.isVisible,
    });
    private notificationTimeout: any;
    private pageHiddenTimeStamp: number | undefined;

    constructor() {
        this._doc.addEventListener(this.documentProperties.eventName, this.handleVisibilityChange, false);
    }

    visibilityChange() {
        return this.visibilityStream.asObservable();
    }

    private handleVisibilityChange = (): void => {
        const isVisible = this.isVisible;

        const pageHiddenDuration = this.pageHiddenTimeStamp ? Date.now() - this.pageHiddenTimeStamp : undefined;
        this.pageHiddenTimeStamp = isVisible ? undefined : Date.now();

        clearTimeout(this.notificationTimeout);
        // wait a bit before launching the event - let things settel down after the page is visible again
        this.notificationTimeout = setTimeout(() => this.visibilityStream.next({ isVisible, pageHiddenDuration }), 150);
    };

    private get isVisible(): boolean {
        return !this._doc[this.documentProperties.hiddenPropertyName as keyof Document];
    }

    private getDocumentProperties(): { eventName: string; hiddenPropertyName: string } {
        if (typeof this._doc.hidden !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            return { eventName: 'visibilitychange', hiddenPropertyName: 'hidden' };
        } else if (typeof (<any>this._doc).msHidden !== 'undefined') {
            return { eventName: 'msvisibilitychange', hiddenPropertyName: 'msHidden' };
        } else if (typeof (<any>this._doc).webkitHidden !== 'undefined') {
            return { eventName: 'webkitvisibilitychange', hiddenPropertyName: 'webkitHidden' };
        }
        return { eventName: '', hiddenPropertyName: '' };
    }
}
