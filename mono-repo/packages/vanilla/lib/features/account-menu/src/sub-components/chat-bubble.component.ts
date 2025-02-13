import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { EventsService, VanillaEventNames, toBoolean } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-am-chat-bubble',
    templateUrl: 'chat-bubble.html',
})
export class ChatBubbleComponent extends AccountMenuItemBase {
    get isAvailable(): boolean {
        const event = this.eventsService.event();
        const eventData = event?.data || {};

        return (
            event?.eventName === VanillaEventNames.ChatUpdate &&
            eventData.isAvailable &&
            !eventData.isOpen &&
            (toBoolean(this.item.parameters.checkWorkingHours) ? eventData.isWithinServiceHours : true)
        );
    }

    constructor(private eventsService: EventsService) {
        super();
    }
}
