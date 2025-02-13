import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { DeviceService } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakConfirmationComponent } from './play-break-confirmation.component';
import { PlayBreakDurationSelectionComponent } from './play-break-duration-selection.component';
import { PlayBreakMandatoryOverlayComponent } from './play-break-mandatory-overlay.component';
import { PlayBreakNotificationOverlayComponent } from './play-break-notification-overlay.component';
import { PlayBreakOverlayComponent } from './play-break-overlay.component';
import { PlayBreakStartSelectionComponent } from './play-break-start-selection.component';
import { PlayBreakNotification, PlayBreakWorkflow, PlayBreakWorkflowStep } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Injectable({
    providedIn: 'root',
})
export class PlayBreakOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
        private playBreakService: PlayBreakService,
        private deviceService: DeviceService,
    ) {
        this.playBreakService.playBreakWorkflow.subscribe((workflow: PlayBreakWorkflow) => {
            switch (workflow.step) {
                case PlayBreakWorkflowStep.DurationSelection:
                    this.showDurationSelection(workflow.notification);
                    break;
                case PlayBreakWorkflowStep.StartSelection:
                    this.showStartSelection(workflow.notification);
                    break;
                case PlayBreakWorkflowStep.Confirmation:
                    this.showConfirmation(workflow.notification);
                    break;
                case PlayBreakWorkflowStep.SubmitBreakSelections:
                    if (workflow.notification.selectedPlayBreakStart) {
                        // show only for delayed break start.
                        this.showSoftBreak(workflow.notification);
                    }
                    break;
            }
        });
    }

    showBreakConfig(notification: PlayBreakNotification) {
        if (!this.currentRef) {
            this.currentRef = this.createOverlay(PlayBreakOverlayComponent, ['generic-modal-overlay', 'vn-player-break-panel'], notification);
        }
    }

    showSoftBreak(notification: PlayBreakNotification) {
        this.createOverlay(PlayBreakNotificationOverlayComponent, ['generic-modal-overlay', 'vn-player-break-panel'], notification);
    }

    showMandatoryBreak(notification: PlayBreakNotification) {
        this.createOverlay(PlayBreakMandatoryOverlayComponent, ['generic-modal-overlay', 'vn-player-break-panel'], notification);
    }

    private showDurationSelection(notification: PlayBreakNotification): OverlayRef {
        const panelClass = this.deviceService.isMobilePhone ? 'generic-modal-drawer' : 'generic-modal-popup';

        return this.createOverlay(PlayBreakDurationSelectionComponent, [panelClass, 'vn-player-break-panel'], notification);
    }

    private showStartSelection(notification: PlayBreakNotification): OverlayRef {
        const panelClass = this.deviceService.isMobilePhone ? 'generic-modal-drawer' : 'generic-modal-popup';

        return this.createOverlay(PlayBreakStartSelectionComponent, [panelClass, 'vn-player-break-panel'], notification);
    }

    private showConfirmation(notification: PlayBreakNotification): OverlayRef {
        const panelClass = this.deviceService.isMobilePhone ? 'generic-modal-drawer' : 'generic-modal-popup';

        return this.createOverlay(PlayBreakConfirmationComponent, [panelClass, 'vn-player-break-panel'], notification);
    }

    private createOverlay(type: ComponentType<BasePlayBreakOverlayComponent>, panelClass: string[], notification: PlayBreakNotification): OverlayRef {
        const overlayRef = this.overlay.create({ panelClass });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            type,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('notification', notification);

        return overlayRef;
    }
}
