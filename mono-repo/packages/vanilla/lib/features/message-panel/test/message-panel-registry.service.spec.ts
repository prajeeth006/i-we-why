import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';

import { MessagePanelRegistry } from '../src/message-panel-registry.service';
import { MessagePanelRegistryEvent } from '../src/message-panel.models';

describe('MessagePanelRegistry', () => {
    let service: MessagePanelRegistry;

    beforeEach(() => {
        service = new MessagePanelRegistry();
    });

    it('add shall publish onChange event with added component', () => {
        let result: MessagePanelRegistryEvent = { component: null };
        service.onChange.subscribe((e) => (result = e));

        const component = {} as MessagePanelComponent;

        service.add(component);
        expect(result.component).toBe(component);
    });

    it('remove shall publish onChange event with latest component matching currentScope', () => {
        let result: MessagePanelRegistryEvent = { component: null };
        service.onChange.subscribe((e) => (result = e));

        service.add({
            currentScope: 'test',
            messages: [{ html: 'test 1' }],
        } as MessagePanelComponent);

        service.add({
            currentScope: '',
            messages: [{ html: 'general 1', scope: '' }],
        } as MessagePanelComponent);

        const component = {
            currentScope: 'test',
            messages: [{ html: 'test 2' }],
        } as MessagePanelComponent;

        service.add(component);

        expect(result.component?.messages[0]!.html).toBe('test 2');

        service.remove(component);

        expect(result.component?.messages[0]!.html).toBe('test 1');
    });
});
