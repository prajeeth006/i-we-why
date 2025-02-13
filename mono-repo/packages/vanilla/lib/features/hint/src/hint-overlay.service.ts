import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';

import { ContentItem } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { HintComponent } from './hint.component';

@Injectable({
    providedIn: 'root',
})
export class HintOverlayService {
    constructor(
        private overlay: OverlayFactory,
        private injector: Injector,
    ) {}

    show(item: ContentItem): [OverlayRef, ComponentRef<HintComponent>] {
        const overlayRef = this.overlay.create({
            panelClass: 'vn-overlay-hint-container',
            scrollStrategy: this.overlay.scrollStrategies.noop(),
        });
        overlayRef.backdropClick().subscribe(() => overlayRef.detach());

        const portal = new ComponentPortal(
            HintComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );
        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('hint', item);

        return [overlayRef, componentRef];
    }
}
