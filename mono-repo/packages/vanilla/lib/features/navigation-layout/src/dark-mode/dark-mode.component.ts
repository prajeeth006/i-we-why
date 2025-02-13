import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DsSwitch } from '@frontend/ui/switch';
import { CommonMessages, HtmlNode } from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { DarkModeService } from '@frontend/vanilla/shared/dark-mode';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DsSwitch],
    selector: 'vn-dark-mode',
    templateUrl: 'dark-mode.html',
})
export class DarkModeComponent implements OnInit {
    @Output() onChange = new EventEmitter<boolean>();

    constructor(
        public content: CommonMessages,
        public service: DarkModeService,
        private accountMenuDataService: AccountMenuDataService,
        private htmlNode: HtmlNode,
    ) {}

    ngOnInit(): void {
        if (this.accountMenuDataService.version === 3) {
            this.htmlNode.setCssClass('navigation-layout-page-card', true);
        }
    }

    toggleDarkMode() {
        this.onChange.emit(!this.service.isEnabled);
        this.service.toggle();
    }
}
