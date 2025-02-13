import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { statusIcons } from './assets/status-icons';
import { DsHelpGroupType } from './help-group.types';

// eslint-disable-next-line @nx/workspace-component-tests-present,@nx/workspace-component-default-story
@Component({
    selector: 'ds-help-item',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './help-item.component.scss',
    template: ` <div class="ds-help-item-icon" [innerHTML]="svg"></div>
        <div class="ds-help-item-text">
            <ng-content select="[slot=text]" />
        </div>`,

    host: {
        '[class.ds-help-item-inverse]': 'inverse()',
        '[class]': 'hostClass()',
    },
})
export class DsHelpItem {
    type = input<DsHelpGroupType>('success');
    isRightAligned = input(false, { transform: booleanAttribute });
    inverse = input(false, { transform: booleanAttribute });
    svg: SafeHtml = '';

    protected hostClass = computed(() => `ds-help-item ds-help-item-${this.type()} ${this.isRightAligned() ? 'ds-help-item-right-alignment' : ''}`);

    constructor(
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
    ) {}

    ngAfterViewInit() {
        const rawSvg = statusIcons[this.type()];
        this.svg = this.sanitizer.bypassSecurityTrustHtml(rawSvg);
        this.cdr.detectChanges();
    }
}
