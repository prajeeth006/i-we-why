import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation, booleanAttribute } from '@angular/core';

import { DsCardHeader } from '@frontend/ui/card-header';

export const DS_CARD_EXPANDABLE_VARIANT_ARRAY = ['surface-lowest', 'surface-low', 'surface-high'] as const;
export type DsCardExpandableVariant = (typeof DS_CARD_EXPANDABLE_VARIANT_ARRAY)[number];
@Component({
    selector: 'ds-card-expandable',
    template: `
        <ds-card-header
            [expandable]="true"
            [title]="title"
            [subtitle]="subtitle"
            [variant]="headerVariant || variant"
            (headerClick)="onHeaderClick()">
            <ng-content select="[slot=start]" ngProjectAs="[slot=start]" />
            <ng-content select="[slot=title]" ngProjectAs="[slot=title]" />
            <ng-content select="[slot=end]" ngProjectAs="[slot=end]" />
        </ds-card-header>

        @if (cardHeader && cardHeader.expanded()) {
            <div class="ds-card-expandable-body">
                <ng-content />
            </div>
        }
    `,
    host: {
        'class': 'ds-card-expandable',
        '[class]': '[hostClass]',
        '[class.ds-card-expandable-no-elevation]': '!elevated',
    },
    standalone: true,
    styleUrls: ['card-expandable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [DsCardHeader],
})
export class DsCardExpandable implements AfterViewInit {
    @ViewChild(DsCardHeader) cardHeader: DsCardHeader | undefined;

    @Input({ required: true }) title!: string;
    @Input() subtitle?: string = '';

    @Input({ transform: booleanAttribute }) elevated = true;
    @Input() variant: DsCardExpandableVariant = 'surface-lowest';
    @Input() headerVariant?: DsCardExpandableVariant;
    @Input({ transform: booleanAttribute }) expanded = false;

    get hostClass() {
        return `ds-card-expandable-${this.variant}`;
    }

    ngAfterViewInit() {
        if (this.cardHeader) {
            this.cardHeader.expanded.set(this.expanded);
        }
    }

    onHeaderClick() {
        if (this.cardHeader) {
            this.cardHeader.toggleExpand();
        }
    }
}
