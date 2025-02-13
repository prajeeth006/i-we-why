import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation, booleanAttribute } from '@angular/core';

import { DS_ATOMS } from '@frontend/ui/shared';

export const DS_NOTIFICATION_BUBBLE_VARIANT_ARRAY = ['primary', 'utility', 'live', 'neutral', 'live-dot', 'utility-dot'] as const;
export type DsNotificationBubbleVariant = (typeof DS_NOTIFICATION_BUBBLE_VARIANT_ARRAY)[number];

export const DS_NOTIFICATION_BUBBLE_SIZE_ARRAY = ['small', 'medium', 'large'] as const;
export type DsNotificationBubbleSize = (typeof DS_NOTIFICATION_BUBBLE_SIZE_ARRAY)[number];

@Component({
    selector: 'ds-notification-bubble',
    template: `
        @if (variant === 'live-dot' || variant === 'utility-dot') {
            <div class="ds-notification-bubble-inside-dot"></div>
        } @else {
            <ng-content />
        }
    `,
    host: {
        'class': 'ds-notification-bubble',
        '[class]': `hostClass`,
        '[class.ds-notification-bubble-disabled]': 'disabled ? true : null',
        '[class.ds-notification-bubble-inverse]': 'inverse',
        '[attr.aria-label]': `getAriaLabel()`,
        '[attr.role]': `'status'`,
    },

    styleUrl: 'notification-bubble.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DS_ATOMS,
            useFactory: () => 'ds-notification-bubble',
        },
    ],
    imports: [NgClass],
})
export class DsNotificationBubble {
    @Input() size: DsNotificationBubbleSize = 'medium';
    @Input() variant: DsNotificationBubbleVariant = 'primary';
    @Input({ transform: booleanAttribute }) disabled? = false;
    @Input({ transform: booleanAttribute }) inverse? = false;

    get hostClass() {
        return `ds-notification-bubble-${this.size} ds-notification-bubble-${this.variant}`;
    }
    constructor(public elementRef: ElementRef<HTMLElement>) {}

    public getAriaLabel(): string {
        if (this.variant.includes('dot')) {
            return this.variant === 'live-dot' ? 'Live notification indicator' : 'Utility notification indicator';
        }

        // const content = this.elementRef.nativeElement.textContent?.trim();
        let content = '';
        if (this.elementRef.nativeElement.textContent) {
            content = `Notification ${this.elementRef.nativeElement.textContent.trim()}`;
        }

        if (this.disabled) {
            return `Disabled notification ${content}`;
        }

        return content;
    }
}
