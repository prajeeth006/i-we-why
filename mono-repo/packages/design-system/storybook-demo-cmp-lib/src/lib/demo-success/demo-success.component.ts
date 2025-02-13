import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ds-demo-success',
    standalone: true,
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.114286 4.8535C0.685714 2.06369 3.04762 0 5.98095 0C9.25714 0 12 2.71338 12 6C12 9.28662 9.29524 12 6.01905 12C3.9619 12 2.13333 10.9299 1.06667 9.36306C0.380952 8.40764 0 7.22293 0 6C0 5.61783 0.0380952 5.23567 0.114286 4.8535ZM5.60355 8.10355L9.10355 4.60355L8.39645 3.89645L5.25 7.04289L3.60355 5.39645L2.89645 6.10355L4.89645 8.10355C5.09171 8.29882 5.40829 8.29882 5.60355 8.10355Z"
                fill="currentColor" />
        </svg>
    `,
    styles: [':host {display: inline-flex; justify-items: center; align-items: center; width: 100%; height: 100%;}'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoSuccessComponent {}
