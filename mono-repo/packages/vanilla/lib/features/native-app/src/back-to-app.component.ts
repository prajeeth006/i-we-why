import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { CommonMessages, Message, MessageQueueService, MessageScope, NavigationService } from '@frontend/vanilla/core';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MessagePanelComponent],
    selector: 'lh-back-to-app',
    templateUrl: 'back-to-app.component.html',
})
export class BackToAppComponent {
    commonMessages = inject(CommonMessages);
    private messageQueue = inject(MessageQueueService);
    private navigation = inject(NavigationService);

    wait = signal<boolean>(false);
    MessageScope = MessageScope;

    constructor() {
        if (this.messageQueue.count() === 0) {
            this.continueToApp();
        } else {
            const effectRef = effect(() => {
                const backToAppMessages = this.messageQueue
                    .messages()
                    .map((message: Message) => Object.assign({}, message, { scope: MessageScope.BackToApp }));
                this.messageQueue.addMultiple(backToAppMessages);

                effectRef.destroy();
            });
        }
    }

    continueToApp() {
        this.wait.set(true);
        this.messageQueue.clear({ clearPersistent: true });
        this.navigation.goToNativeApp({ replace: true });
    }
}
