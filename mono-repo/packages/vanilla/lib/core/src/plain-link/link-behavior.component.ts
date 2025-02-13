import { Component } from '@angular/core';

import { PlainLinkBehaviorDirective } from './plain-link-behavior.directive';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector, @angular-eslint/component-selector
    selector: 'a[href]:not([routerLink]):not([plain-link])',
    template: '<ng-container />',
    hostDirectives: [PlainLinkBehaviorDirective],
})
export class LinkBehaviorComponent {}
