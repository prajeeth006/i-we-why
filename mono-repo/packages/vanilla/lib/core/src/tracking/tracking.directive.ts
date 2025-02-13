import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { get, transform } from 'lodash-es';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TrackingService } from './tracking-core.service';

/**
 * @whatItDoes Sets up tracking on an HTML element.
 *
 * @howToUse
 *
 * ```
 * <button vnTrackingEvent="Some_Event">IMPORTANT CTA</button>
 * ```
 *
 * @description
 *
 * This directive attaches to specified DOM events (`click` if the default if none are specified). You can specified custom events
 * with `vnTrackingTrigger` input - this can be a `string` or `string[]`. For example:
 *
 * ```
 * <input type="text" vnTrackingEvent="Event_Name" [vnTrackingTrigger]="['keyup', 'blur']"></input>
 * ```
 *
 * You can also specify additional data to track with `vnTrackingData` input - this can be an object or a function (for more complicated cases).
 * Placeholders are also supported for including a value from the HTML event.
 *
 * ```
 * <button vnTrackingEvent="Some_Event" vnTrackingData="{ param: 'someValue', value: '${event.target.value}' }">IMPORTANT CTA</button>
 * ```
 *
 * The placeholders are also replaced in the keys of the data collection and in the event name.
 *
 * For more complex cases you might need to construct custom data using a callback.
 *
 * ```
 * <button vnTrackingEvent="Some_Event" vnTrackingData="getTrackingData">IMPORTANT CTA</button>
 *
 * // in a component
 * getCustomData(e: Event) {
 *     return {
 *         e.type,
 *         customParam: this.getCustomParam()
 *     };
 * }
 * ```
 *
 * @stable
 */
@Directive({ standalone: true, selector: '[vnTrackingEvent]' })
export class TrackingDirective implements OnDestroy, OnInit {
    @Input() set vnTrackingEvent(value: string) {
        this.eventName = value;
        if (!this.eventName) {
            this.unsetTriggers();
        }
    }
    @Input() set vnTrackingTrigger(value: string | string[]) {
        if (value !== this.triggers) {
            this.triggers = value;

            this.unsetTriggers();
            this.setTriggers();
        }
    }
    @Input() vnTrackingData: { [key: string]: any } | ((e: Event) => { [key: string]: any });

    private eventName: string;
    private triggers: string[] | string | undefined;
    private triggersSet: boolean;
    private element: HTMLElement;
    private unsubscribe = new Subject<void>();

    constructor(
        elementRef: ElementRef,
        private trackingService: TrackingService,
    ) {
        this.element = elementRef.nativeElement;
    }

    ngOnDestroy() {
        this.unsetTriggers();
        this.unsubscribe.complete();
    }

    ngOnInit() {
        this.setTriggers();
    }

    private setTriggers() {
        if (!this.triggersSet && this.eventName) {
            const triggers = Array.isArray(this.triggers) ? this.triggers : [this.triggers ? this.triggers : 'click'];
            triggers.forEach((t) =>
                fromEvent<Event>(this.element, t)
                    .pipe(takeUntil(this.unsubscribe))
                    .subscribe((e) => this.track(e)),
            );
            this.triggersSet = true;
        }
    }

    private unsetTriggers() {
        if (this.triggersSet) {
            this.unsubscribe.next();
            this.triggersSet = false;
        }
    }

    private track(e: Event) {
        const eventName = this.replaceEventPlaceholders(this.eventName, e);

        this.trackingService.triggerEvent(eventName, this.getData(e));
    }

    private getData(e: Event): { [key: string]: any } | null {
        if (!this.vnTrackingData) {
            return null;
        }

        if (this.vnTrackingData instanceof Function) {
            return this.vnTrackingData(e);
        }

        return transform(
            this.vnTrackingData,
            (result: { [key: string]: string }, value, key) => {
                result[this.replaceEventPlaceholders(key, e)] = this.replaceEventPlaceholders(value, e);
            },
            {},
        );
    }

    private replaceEventPlaceholders(value: string, e: Event) {
        return value.replace(/\$\{(.*?)\}/g, (_, path) => {
            path = path.replace('event.', '');

            return get(e, path);
        });
    }
}
