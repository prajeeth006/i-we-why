import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { MessagePanelRegistry } from '../src/message-panel-registry.service';
import { MessagePanelRegistryEvent } from '../src/message-panel.models';

@Mock({ of: MessagePanelRegistry })
export class MessagePanelRegistryMock {
    onChange: Subject<MessagePanelRegistryEvent> = new Subject<MessagePanelRegistryEvent>();
    @Stub() add: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
}
