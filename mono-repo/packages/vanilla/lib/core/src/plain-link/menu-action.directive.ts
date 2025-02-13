import { Directive, ElementRef, OnInit, inject } from '@angular/core';

import { MenuActionOrigin } from '../menu-actions/menu-actions.models';
import { MenuActionsService } from '../menu-actions/menu-actions.service';
import { AnchorTrackingHelperService } from './anchor-tracking-helper-service';
import { LinkBehaviorDirective } from './link-behavior.directive';

@Directive({
    standalone: true,
    host: { '(click)': 'processClick($event)' },
    // eslint-disable-next-line @angular-eslint/directive-selector, @angular-eslint/component-selector
    selector: '[menu-action]',
    hostDirectives: [LinkBehaviorDirective],
})
export class MenuActionDirective implements OnInit {
    private anchorHelperService = inject(AnchorTrackingHelperService);
    private elementRef = inject(ElementRef<HTMLElement>);
    private menuActionsService = inject(MenuActionsService);

    ngOnInit() {
        if (this.elementRef.nativeElement['originalAttributes']) {
            this.elementRef.nativeElement.setAttribute('menu-action', this.elementRef.nativeElement['originalAttributes'].get('menu-action'));
        }
    }
    processClick(event: Event) {
        const element = event.currentTarget as HTMLElement;
        const menuActionsParameters = this.anchorHelperService.createMenuActionData(element);
        const menuAction = element.getAttribute('menu-action');
        event.preventDefault();
        this.menuActionsService.invoke(menuAction!, MenuActionOrigin.Misc, [undefined, undefined, menuActionsParameters]);
    }
}
