import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormElementTemplateForClient, ListItem, trackByProp } from '@frontend/vanilla/core';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { FormFieldComponent } from '@frontend/vanilla/shared/forms';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakWorkflowStep } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Component({
    standalone: true,
    selector: 'vn-play-break-duration-selection',
    templateUrl: 'play-break-duration-selection.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, DialogComponent],
})
export class PlayBreakDurationSelectionComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly trackByText = trackByProp<ListItem>('text');
    readonly durationSelectionForm = signal<FormGroup>(
        new FormGroup({
            durationOptions: new FormControl(),
        }),
    );
    readonly breakDurationForm = computed<FormElementTemplateForClient | undefined>(
        () => this.config.templates.breakdurationselection?.form[`breakdurationform${this.breakType()}`],
    );

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        public config: PlayBreakConfig,
        private playBreakTrackingService: PlayBreakTrackingService,
        playBreakService: PlayBreakService,
        overlayRef: OverlayRef,
    ) {
        super(playBreakService, overlayRef);
    }

    ngOnInit() {
        this.durationSelectionForm()
            .controls.durationOptions?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value: string) => {
                this.notification().selectedPlayBreakDuration = Number(value);

                if (this.breakType()) {
                    this.playBreakTrackingService.trackLSL24StepDrawerClick(
                        'drop-down selector',
                        'first step of break selection drawer - lsl24',
                        'select value',
                        'not applicable',
                    );
                } else {
                    this.playBreakTrackingService.trackDurationSelectionChange();
                }
            });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepLoad('first step of break selection drawer - lsl24', 'first step of break selection drawer');
        } else {
            this.playBreakTrackingService.trackDurationSelectionOpen();
        }
    }

    confirmSelection() {
        this.playBreakService.changePlayBreakWorkflow({
            step: PlayBreakWorkflowStep.StartSelection,
            notification: this.notification(),
        });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'select value',
                'first step of break selection drawer - lsl24',
                'continue',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackDrawerContinue();
        }

        this.closeOverlay();
    }

    close() {
        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'not applicable',
                'first step of break selection drawer - lsl24',
                'cancel',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackDurationSelectionCancel();
        }

        this.closeOverlay();
    }
}
