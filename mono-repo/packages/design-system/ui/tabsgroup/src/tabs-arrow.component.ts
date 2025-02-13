import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-default-story, @nx/workspace-component-tests-present
@Component({
    selector: 'ds-tabs-arrow',
    standalone: true,
    template: `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.35949 6.19233L3.85949 10.8475L3.1405 10.1525L7.29278 5.85702L3.1527 1.85969L3.84729 1.14029L8.34729 5.48512C8.44273 5.57726 8.49764 5.70356 8.49992 5.8362C8.50221 5.96884 8.45169 6.09695 8.35949 6.19233Z"
                fill="black" />
        </svg>
    `,
    host: {
        '[class.ds-left-arrow]': "direction() === 'left'",
    },
    styles: [
        `
            :host {
                display: inline-flex;
                justify-items: center;
                align-items: center;
                height: 100%;
                max-width: 100%;

                &.ds-left-arrow {
                    transform: rotate(180deg);
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTabsScrollArrow {
    direction = input<'right' | 'left'>('right');
}
