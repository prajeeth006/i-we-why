import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

@Component({
    selector: 'ds-list-item',
    standalone: true,
    imports: [CommonModule],
    template: `
        <ng-content select="[slot=start]" />
        @if (showCenterSlot()) {
            <div class="ds-list-tile-text">
                <span class="ds-list-tile-title" [class.ds-list-title-strong]="boldTitle()">
                    {{ title() }}
                </span>
                @if (subtitle()) {
                    <span class="ds-list-tile-sub-title">{{ subtitle() }}</span>
                }
                @if (subtext()) {
                    <span class="ds-list-tile-sub-text">{{ subtext() }}</span>
                }
            </div>
        }
        <div class="ds-list-end-slot">
            <ng-content select="[slot=end]" />
        </div>
    `,
    styleUrl: './list-item.component.scss',
    host: {
        'class': 'ds-list-item',
        '[class.ds-list-item-selected]': 'selected()',
        '[class.ds-list-item-inverse]': 'inverse()',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsListItem {
    title = input.required<string>();
    subtitle = input<string>('');
    subtext = input<string>('');
    selected = input(false, { transform: booleanAttribute });
    inverse = input(false, { transform: booleanAttribute });
    boldTitle = input(true, { transform: booleanAttribute });
    showCenterSlot = input(true, { transform: booleanAttribute });
}
