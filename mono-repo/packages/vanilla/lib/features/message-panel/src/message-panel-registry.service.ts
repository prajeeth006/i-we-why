import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { IMessagePanelComponent, MessagePanelRegistryEvent } from './message-panel.models';

@Injectable({
    providedIn: 'root',
})
export class MessagePanelRegistry {
    get onChange(): Observable<MessagePanelRegistryEvent> {
        return this.onChangeSubject.asObservable();
    }

    private onChangeSubject = new Subject<MessagePanelRegistryEvent>();
    private components = [] as IMessagePanelComponent[];

    add(component: IMessagePanelComponent) {
        this.components.push(component);
        this.onChangeSubject.next({ component });
    }

    remove(component: IMessagePanelComponent) {
        const index = this.components.indexOf(component);
        this.components.splice(index, 1);

        const componentsInScope = this.components.filter((c: IMessagePanelComponent) => c.currentScope === component.currentScope);
        const lastMessagePanelComponent = componentsInScope[componentsInScope.length - 1] || null;

        this.onChangeSubject.next({
            component: lastMessagePanelComponent,
        });
    }
}
