import { Injectable } from '@angular/core';

import {
    LocationChangeEvent,
    MenuContentItem,
    NavigationService,
    OnFeatureInit,
    UserEvent,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { firstValueFrom, map, merge } from 'rxjs';
import { delay } from 'rxjs/operators';

import { DebounceButtonsConfig } from './debounce-buttons.client-config';
import { DebounceButtonsService } from './debounce-buttons.service';

@Injectable()
export class DebounceButtonsBootstrapService implements OnFeatureInit {
    constructor(
        private debounceButtonConfig: DebounceButtonsConfig,
        private debounceButtonService: DebounceButtonsService,
        private userService: UserService,
        private navigationService: NavigationService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.debounceButtonConfig.whenReady);

        this.debounceButtonConfig.items?.map((item: MenuContentItem) => {
            this.debounceButtonService.init(item.parameters);
        });

        merge(this.userService.events, this.navigationService.locationChange)
            .pipe(
                map(
                    (event: UserEvent | LocationChangeEvent) =>
                        event instanceof UserLoginEvent ||
                        ('previousUrl' in event && 'currentUrl' in event && event.previousUrl !== event.currentUrl),
                ),
                delay(2000),
            )
            .subscribe(() => {
                this.debounceButtonConfig.items?.map((item: MenuContentItem) => {
                    this.debounceButtonService.init(item.parameters);
                });
            });
    }
}
