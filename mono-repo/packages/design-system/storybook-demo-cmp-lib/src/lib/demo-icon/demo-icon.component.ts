import { ChangeDetectionStrategy, Component, ElementRef, SecurityContext, effect, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { IconsListType } from './demo-icon-svg.interface';

@Component({
    selector: 'ds-demo-icon',
    standalone: true,
    template: ``,
    styles: [':host {display: inline-flex; justify-items: center; align-items: center; height: 100%; max-width: 100%;}'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @internal
 * @WhatItDoes: Simple reading svg files from packages\design-system\shared-ds-utils\src\assets\demo-icons (assets path set in package.json)
 * and it appends with InnerHtml to the component DOM
 */
export class DemoIconComponent {
    private _sanitizer = inject(DomSanitizer);
    private _hostElement = inject(ElementRef);

    iconName = input<keyof IconsListType>('placeholder');

    constructor() {
        effect(() => {
            // eslint-disable-next-line n/no-unsupported-features/node-builtins
            fetch(`demo-icons/${this.iconName()}.svg`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }
                    response
                        .text()
                        .then((value) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            this._hostElement.nativeElement.innerHTML = this._sanitizer.sanitize(
                                SecurityContext.HTML,
                                this._sanitizer.bypassSecurityTrustHtml(value),
                            );
                        })
                        .catch((error: unknown) => {
                            console.error(error);
                        });
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        });
    }
}
