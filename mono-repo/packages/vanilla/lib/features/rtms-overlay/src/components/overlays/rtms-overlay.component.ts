import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { NotificationMessageHeaderType } from '@frontend/vanilla/shared/rtms';

import { RtmsCtaActionComponent } from '../rtms-cta-action.component';
import { RtmsOverlayComponentBase } from './rtms-overlay-component-base';

@Component({
    standalone: true,
    imports: [RtmsCtaActionComponent, CommonModule, TrustAsHtmlPipe, ImageComponent, IconCustomComponent],
    selector: 'vn-rtms-overlay',
    templateUrl: 'rtms-overlay.component.html',
})
export class RtmsOverlayComponent extends RtmsOverlayComponentBase {
    @ViewChild('modalContentWrapperEl') modalContentWrapperEl: ElementRef;
    @ViewChild('modalContentEl') modalContentEl: ElementRef;
    HeaderType = NotificationMessageHeaderType;

    constructor() {
        super();
    }

    get isShadowOnActions() {
        return this.modalContentEl?.nativeElement.offsetHeight > this.modalContentWrapperEl?.nativeElement.offsetHeight;
    }
}
