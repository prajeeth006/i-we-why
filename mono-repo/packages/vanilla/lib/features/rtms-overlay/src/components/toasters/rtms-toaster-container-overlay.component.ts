import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';

import { trackByProp } from '@frontend/vanilla/core';
import { NotificationMessage, RtmsCommonService, RtmsLayerConfig } from '@frontend/vanilla/shared/rtms';

import { RtmsToasterItemComponent } from './rtms-toaster-item.component';

@Component({
    standalone: true,
    imports: [RtmsToasterItemComponent, CommonModule],
    selector: 'vn-rtms-toaster-container-overlay',
    templateUrl: 'rtms-toaster-container-overlay.html',
    styleUrls: ['../../../../../../../themepark/themes/whitelabel/components/rtms/rtms-toaster/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RtmsToasterOverlayComponent implements OnInit {
    private overlayRef = inject(OverlayRef);
    private rtmsConfig = inject(RtmsLayerConfig);
    private rtmsCommonService = inject(RtmsCommonService);
    stacked: boolean = this.rtmsConfig.enableToastStacking;
    messagesContent: any;
    readonly trackById = trackByProp<NotificationMessage>('id');
    get toasterItems() {
        return this.rtmsCommonService.toasterList;
    }

    ngOnInit() {
        this.messagesContent = this.rtmsCommonService.rtmsCommonContent;
    }

    toggleStacking() {
        if (this.rtmsConfig.enableToastStacking) {
            this.stacked = !this.stacked;
        }
    }
    close(id: string) {
        if (this.toasterItems.length == 1) {
            this.overlayRef.detach();
            this.rtmsCommonService.nextMessage();
        }
        this.rtmsCommonService.toasterList = this.toasterItems.filter((x: NotificationMessage) => x.id !== id);
    }
}
