import { Injectable } from '@angular/core';

import { skip } from 'rxjs/operators';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { NavigationService } from '../navigation/navigation.service';
import { MessageQueueService } from './message-queue.service';

@Injectable()
export class MessageQueueBootstrapService implements OnAppInit {
    constructor(
        private messageQueueService: MessageQueueService,
        private navigationService: NavigationService,
    ) {}

    onAppInit() {
        this.messageQueueService.restoreMessages();

        this.navigationService.locationChange.pipe(skip(1)).subscribe(() => {
            this.messageQueueService.clear();
        });
    }
}
