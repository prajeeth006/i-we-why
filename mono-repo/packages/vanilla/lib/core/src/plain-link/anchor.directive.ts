import { Directive } from '@angular/core';

import { PlainLinkBehaviorDirective } from './plain-link-behavior.directive';

@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector, @angular-eslint/component-selector
    selector: 'a[href]:not([routerLink]):not([plain-link])',
    hostDirectives: [PlainLinkBehaviorDirective],
})
export class AnchorDirective {}
