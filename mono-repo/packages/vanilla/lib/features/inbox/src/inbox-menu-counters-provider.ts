import { Injectable } from '@angular/core';

import { MenuCounters, MenuCountersProvider, MenuSection } from '@frontend/vanilla/core';

import { InboxService } from './services/inbox.service';

@Injectable({ providedIn: 'root' })
export class InboxMenuCountersProvider implements MenuCountersProvider {
    get order() {
        return 10;
    }

    constructor(private inboxService: InboxService) {}

    setCounters(counters: MenuCounters): void {
        const value = this.inboxService.getCount() || null;

        counters.set(MenuSection.Menu, 'myinbox', value);
        counters.set(MenuSection.Header, 'inbox', value);
    }
}
