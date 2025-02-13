import { GenericListItem } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { DropDownHeaderContent } from '../src/dropdown-header.client-config';
import { DropDownHeaderService } from '../src/dropdown-header.service';

@Mock({ of: DropDownHeaderContent })
export class DropDownHeaderContentMock extends DropDownHeaderContent {
    override whenReady = new Subject<void>();
    constructor() {
        super();
        this.elements = { logo: { name: 'logo' } } as any;
        this.resources = { messages: {} } as GenericListItem;
    }
}

@Mock({ of: DropDownHeaderService })
export class DropDownHeaderServiceMock {
    dropDownMenuToggle: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @Stub() getDropDownHeaderComponent: jasmine.Spy;
    @Stub() setDropDownHeaderComponent: jasmine.Spy;
    @Stub() toggleMenu: jasmine.Spy;
}
