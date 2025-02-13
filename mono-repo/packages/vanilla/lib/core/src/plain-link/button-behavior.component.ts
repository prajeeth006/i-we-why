import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DsButton } from '@frontend/ui/button';

import { PlainLinkBehaviorDirective } from './plain-link-behavior.directive';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector, @angular-eslint/component-selector
    selector: 'a[ds-button]',
    imports: [CommonModule],
    hostDirectives: [PlainLinkBehaviorDirective],
    templateUrl: '../../../../../design-system/ui/button/src/button.component.html',
    styleUrl: '../../../../../design-system/ui/button/src/button.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class ButtonBehaviorComponent extends DsButton {}
