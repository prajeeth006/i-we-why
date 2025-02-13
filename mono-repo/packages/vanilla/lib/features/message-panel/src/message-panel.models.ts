import { Message } from '@frontend/vanilla/core';

export interface IMessagePanelComponent {
    currentScope: string;
    messages: Message[];
}

export class MessagePanelRegistryEvent {
    component: IMessagePanelComponent | null;
}
