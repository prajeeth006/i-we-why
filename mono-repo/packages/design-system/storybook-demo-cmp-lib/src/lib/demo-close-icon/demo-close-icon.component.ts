import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ds-demo-close-icon',
    standalone: true,
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-label="Close icon">
            <path d="M2 2 L14 14 M2 14 L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
    `,
    styles: [':host {display: inline-flex; justify-content: center; align-items: center; height: 100%; max-width: 100%;}'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCloseIconComponent {}
