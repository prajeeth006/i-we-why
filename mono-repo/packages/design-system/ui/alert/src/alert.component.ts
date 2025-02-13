import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Input,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DsIconButton } from '@frontend/ui/icon-button';

import { statusIcons } from './assets/status-icons';

export const DS_ALERT_TYPE_ARRAY = ['success', 'error', 'caution', 'info'] as const;
export type DsAlertType = (typeof DS_ALERT_TYPE_ARRAY)[number];

@Component({
    selector: 'ds-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    imports: [NgTemplateOutlet, DsIconButton, CommonModule],
    standalone: true,
    host: {
        'class': 'ds-alert-container ds-alert-default',
        '[class]': 'host',
        '[class.ds-alert-inverse]': 'inverse',
        'role': 'alert',
        'aria-live': 'polite',
        '[attr.aria-label]': 'type + " alert"',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsAlert {
    @Input() type: DsAlertType = 'success';
    @Input({ transform: booleanAttribute }) inverse = false;
    @ContentChild('slot="header"') header?: TemplateRef<any>;
    svg: SafeHtml = '';

    get host() {
        return `ds-alert-${this.type}`;
    }
    constructor(
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
    ) {}

    ngAfterViewInit() {
        const rawSvg = statusIcons[this.type];
        this.svg = this.sanitizer.bypassSecurityTrustHtml(rawSvg);
        this.cdr.detectChanges();
    }
}
