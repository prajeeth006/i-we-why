import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { RtmsCtaActionComponent } from './rtms-cta-action.component';
import { RtmsLayerComponentBase } from './rtms-layer-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, RtmsCtaActionComponent, ImageComponent, IconCustomComponent],
    selector: 'lh-rtms-layer-overlay',
    templateUrl: 'rtms-layer-overlay.component.html',
})
export class RtmsLayerOverlayComponent extends RtmsLayerComponentBase {
    constructor(timerService: TimerService) {
        super(timerService);
    }
}
