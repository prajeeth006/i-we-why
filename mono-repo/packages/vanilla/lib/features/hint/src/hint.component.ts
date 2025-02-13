import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';

import { ContentItem, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { PageMatrixComponent } from '@frontend/vanilla/features/content';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { toNumber } from 'lodash-es';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PageMatrixComponent, IconCustomComponent],
    selector: 'vn-hint',
    templateUrl: 'hint.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/bookmark-hint/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HintComponent implements OnInit, OnDestroy {
    @Input() hint: ContentItem | undefined;
    closeIcon: string;

    private overlayRef = inject(OverlayRef);
    private webWorkerService = inject(WebWorkerService);

    ngOnInit() {
        this.closeIcon = this.hint?.parameters?.['closeIcon'] || 'theme-close-i';
        const timeOutParam = this.hint?.parameters?.['timeOut'];

        if (timeOutParam) {
            const timeOut = toNumber(timeOutParam);

            if (timeOut) {
                this.webWorkerService.createWorker(WorkerType.HintTimerTimeout, { timeout: timeOut }, () => {
                    this.closeMessage();
                });
            }
        }
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.HintTimerTimeout);
    }

    closeMessage() {
        this.overlayRef.detach();
    }
}
