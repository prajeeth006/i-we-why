import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { MenuAction } from '../menu-actions/menu-actions.models';
import { MenuActionsService } from '../menu-actions/menu-actions.service';
import { NavigationService } from '../navigation/navigation.service';
import { EventsService, VanillaEventNames } from '../utils/events.service';
import { ToastrQueueService } from './toastr-queue.service';

@Injectable()
export class ToastrQueueBootstrapService implements OnAppInit {
    constructor(
        private menuActionsService: MenuActionsService,
        private toastrQueueService: ToastrQueueService,
        private navigationService: NavigationService,
        private eventsService: EventsService,
    ) {}

    onAppInit(): void | Promise<any> {
        this.menuActionsService.register(MenuAction.CLOSE_TOASTR, () => {
            this.toastrQueueService.currentToast?.toast.toastRef.manualClose();

            this.eventsService.raise({
                eventName: VanillaEventNames.ToastrClosed,
                data: { toastrContent: this.toastrQueueService.currentToast?.content },
            });
        });

        this.navigationService.locationChange.subscribe(() => this.toastrQueueService.onNavigation());

        if (this.navigationService.location.search.has('_showToast')) {
            const toastName = this.navigationService.location.search.get('_showToast')!;
            const placeholders = this.navigationService.location.search.get('_placeholders')!;
            let parsedPlaceholder = {};
            try {
                parsedPlaceholder = placeholders !== null ? JSON.parse(placeholders) : {};
            } catch {}

            this.toastrQueueService.add(toastName, { placeholders: parsedPlaceholder });

            const newUrl = this.navigationService.location.clone();
            newUrl.search.delete('_showToast');
            newUrl.search.delete('_placeholders');
            this.navigationService.goTo(newUrl, { replace: true });
        }
    }
}
