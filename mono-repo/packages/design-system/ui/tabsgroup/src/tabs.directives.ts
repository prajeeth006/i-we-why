import { Directive } from '@angular/core';

import { DsTabContext } from './tabs-context';

@Directive({
    selector: 'ng-template[dsTabHeader]',
    standalone: true,
})
export class DsTabHeader {
    static ngTemplateContextGuard(directive: DsTabHeader, context: unknown): context is DsTabContext {
        return true;
    }
}

@Directive({
    selector: 'ng-template[dsTabContent]',
    standalone: true,
})
export class DsTabContent {}
