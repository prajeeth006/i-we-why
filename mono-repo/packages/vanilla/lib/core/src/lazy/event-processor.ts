import { InjectionToken, Provider, Type } from '@angular/core';

export enum EventType {
    Native = 'native',
    Rtms = 'rtms',
    Vanilla = 'vanilla',
}

export interface EventContext<T> {
    name: string;
    type: EventType;
    data?: T;
}

export const EVENT_PROCESSOR = new InjectionToken<EventProcessor>('vn-event-processor');

/**
 * @whatItDoes Hook that is called whenever event is detected.
 *
 * @description
 *
 * Services that implement this interface can be registered with `registerProcessor(Service)`.
 *
 * @experimental
 */

export interface EventProcessor {
    process(context: EventContext<any>): void | Promise<void>;
}

/**
 * @whatItDoes Registers an event processor.
 *
 * @stable
 */
export function registerEventProcessor<T extends EventProcessor>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: EVENT_PROCESSOR,
            multi: true,
            useExisting: type,
        },
    ];
}
