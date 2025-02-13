import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DsLoadingSpinner } from '@frontend/ui/loading-spinner';

import { CommonMessages } from '../client-config/common-messages.client-config';
import { Page } from '../client-config/page.client-config';
import { UtilsService } from '../utils/utils.service';
import { LoadingIndicatorService } from './loading-indicator.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DsLoadingSpinner],
    selector: 'vn-loading-indicator',
    templateUrl: 'loading-indicator.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {
    content: SafeHtml;
    loadingIndicatorV2: boolean = false;
    constructor(
        public loadingIndicatorService: LoadingIndicatorService,
        public commonMessages: CommonMessages,
        private page: Page,
        sanitizer: DomSanitizer,
    ) {
        this.content = sanitizer.bypassSecurityTrustHtml(page.loadingIndicator.spinnerContent);
        this.loadingIndicatorV2 = this.page.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.page.htmlSourceTypeReplace, 'ds-loading-spinner')
            : false;
    }
}
