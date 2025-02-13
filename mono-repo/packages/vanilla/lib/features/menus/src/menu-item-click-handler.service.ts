import { Injectable, inject } from '@angular/core';

import { Logger, MenuActionsService, MenuContentItem } from '@frontend/vanilla/core';

@Injectable({ providedIn: 'root' })
export class MenuItemClickHandlerService {
    private menuActionsService = inject(MenuActionsService);
    private log = inject(Logger);

    async handleMenuTrack(item: MenuContentItem) {
        await this.menuActionsService.trackClick(item, true).catch((error) => {
            this.log.error(`Error while tracking menu item click.`, error);
        });
    }

    async handleMenuAction(event: Event, item: MenuContentItem, origin: string, processClick: boolean | undefined) {
        if (processClick !== false) {
            await this.menuActionsService.processClick(event, item, origin, false).catch((error) => {
                this.log.error(`Error while tracking menu item click.`, error);
            });
        }
    }
}
