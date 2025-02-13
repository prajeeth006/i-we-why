import { MenuContentSection } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ResponsiveFooterContent } from '../src/footer.client-config';

@Mock({ of: ResponsiveFooterContent })
export class ResponsiveFooterContentMock extends ResponsiveFooterContent {
    override whenReady: Subject<void> = new Subject<void>();

    constructor() {
        super();

        this.logos = <any>{ left: [], right: [] };
        this.links = <MenuContentSection>{ items: [], name: '', authstate: '', class: '', title: '' };
        this.showLanguageSwitcherDslCondition = 'showLangDsl';
        this.showHelpButton = true;
        this.footerTopItems = <any>{ regulatory: [] };
    }
}
