import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { TimerService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { RtmsCtaActionComponent } from './rtms-cta-action.component';
import { RtmsLayerComponentBase } from './rtms-layer-component-base';

@Component({
    standalone: true,
    imports: [CommonModule, RtmsCtaActionComponent, ImageComponent, IconCustomComponent],
    selector: 'lh-rtms-layer-toaster',
    templateUrl: 'rtms-layer-toaster.component.html',
})
export class RtmsLayerToasterComponent extends RtmsLayerComponentBase {
    @Output() onManualClose: EventEmitter<any> = new EventEmitter();

    constructor(timerService: TimerService) {
        super(timerService);
    }

    override close() {
        this.onManualClose.emit();
    }
}
