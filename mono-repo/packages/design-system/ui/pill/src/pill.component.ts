import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    DestroyRef,
    Input,
    QueryList,
    ViewEncapsulation,
    booleanAttribute,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DS_ATOMS } from '@frontend/ui/shared';

export const DS_PILL_VARIANTS_ARRAY = ['current', 'subtle', 'strong'] as const;
export type DsPillVariant = (typeof DS_PILL_VARIANTS_ARRAY)[number];

export const DS_PILL_SIZE_ARRAY = ['small', 'medium'] as const;
export type DsPillSize = (typeof DS_PILL_SIZE_ARRAY)[number];

@Component({
    selector: '[ds-pill]',
    template: `
        <ng-content select="[slot=start]" />
        <span class="ds-pill-text">
            <ng-content />
        </span>
        <ng-content select="[slot=end]" />
        <span class="ds-button-touch-target"></span>
    `,
    host: {
        'class': 'ds-pill',
        '[class]': '["ds-pill-" + variant, "ds-pill-" + size]',
        '[class.ds-pill-selected]': 'selected',
        '[class.ds-pill-disabled]': 'disabled',
        '[attr.disabled]': 'disabled ? true : null',
        '[class.ds-pill-rounded-padding]': 'roundedPadding()',
        '[class.ds-pill-inverse]': 'inverse',
        '[attr.aria-disabled]': 'disabled',
    },
    styleUrl: 'pill.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsPill implements AfterContentInit {
    private destroyRef = inject(DestroyRef);

    @Input({ transform: booleanAttribute }) selected = false;

    @Input() variant: DsPillVariant = 'current';

    @Input() size: DsPillSize = 'medium';

    @Input({ transform: booleanAttribute }) disabled = false;

    @Input({ transform: booleanAttribute }) inverse = false;

    //TODO use signal-based content queries
    /**
     * Retrieves and holds the list of child components or directives that implement the `DsAtoms` interface when
     * they are projected into the current component's content slots and are instances of the injection token `DS_ATOMS`.
     * If there are any children that implement `DsAtoms` interface are present, the host class `ds-pill-rounded-padding`
     * is added to the `ds-pill` component.
     */
    @ContentChildren(DS_ATOMS) dsAtoms?: QueryList<string>;

    roundedPadding = signal(false);

    ngAfterContentInit() {
        this.setRoundedPadding();
        this.dsAtoms?.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.setRoundedPadding();
        });
    }

    private setRoundedPadding() {
        const includesNotificationBubble = this.dsAtoms?.some((item) => item === 'ds-notification-bubble');
        this.roundedPadding.set(!!includesNotificationBubble);
    }
}
