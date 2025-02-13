import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ds-loading-spinner',
    standalone: true,
    template: `
        <svg class="ds-loading-spinner-svg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-1"
                x="23.134"
                y="1.64362"
                width="2"
                height="8"
                transform="rotate(30 23.134 1.64362)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-2"
                x="29.3564"
                y="7.13403"
                width="2"
                height="8"
                transform="rotate(60 29.3564 7.13403)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-3"
                x="32"
                y="15"
                width="2"
                height="8"
                transform="rotate(90 32 15)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-4"
                x="30.3564"
                y="23.134"
                width="2"
                height="8"
                transform="rotate(120 30.3564 23.134)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-5"
                x="24.866"
                y="29.3564"
                width="2"
                height="8"
                transform="rotate(150 24.866 29.3564)"
                fill="currentColor" />
            <rect class="ds-loading-spinner-el ds-loading-spinner-el-6" x="15" y="24" width="2" height="8" fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-7"
                x="11.134"
                y="22.4282"
                width="2"
                height="8"
                transform="rotate(30 11.134 22.4282)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-8"
                x="8.57178"
                y="19.134"
                width="2"
                height="8"
                transform="rotate(60 8.57178 19.134)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-9"
                x="8"
                y="15"
                width="2"
                height="8"
                transform="rotate(90 8 15)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-10"
                x="9.57178"
                y="11.134"
                width="2"
                height="8"
                transform="rotate(120 9.57178 11.134)"
                fill="currentColor" />
            <rect
                class="ds-loading-spinner-el ds-loading-spinner-el-11"
                x="12.866"
                y="8.57178"
                width="2"
                height="8"
                transform="rotate(150 12.866 8.57178)"
                fill="currentColor" />
            <rect class="ds-loading-spinner-el ds-loading-spinner-el-12" x="15" width="2" height="8" fill="currentColor" />
        </svg>
    `,
    styleUrl: './loading-spinner.component.scss',
    host: {
        'class': 'ds-loading-spinner',
        'aria-live': 'polite',
        'aria-busy': 'true',
        'aria-label': 'Loading',
        'role': 'status',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsLoadingSpinner {}
