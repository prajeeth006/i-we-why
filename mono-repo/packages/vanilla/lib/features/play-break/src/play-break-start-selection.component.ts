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
    selector: 'vn-play-break-start-selection',
    templateUrl: 'play-break-start-selection.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, ReactiveFormsModule, DialogComponent, FormFieldComponent],
})
export class PlayBreakStartSelectionComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly trackByText = trackByProp<ListItem>('text');
    readonly startSelectionForm = signal<FormGroup>(
        new FormGroup({
            startOptions: new FormControl(),
        }),
    );
    readonly breakStartForm = computed<FormElementTemplateForClient | undefined>(
        () => this.config.templates.breakstartselection?.form[`breakstartform${this.breakType()}`],
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
        this.startSelectionForm()
            .controls.startOptions?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value: string) => {
                // TODO: Use model after Angular 17.2.0 update: https://github.com/angular/angular/issues/53982
                this.notification().selectedPlayBreakStart = Number(value);

                if (this.breakType()) {
                    this.playBreakTrackingService.trackLSL24StepDrawerClick(
                        'drop-down selector',
                        'second step of break selection drawer - lsl24',
                        'select value',
                        'not applicable',
                    );
                } else {
                    this.playBreakTrackingService.trackDrawerPeriodSelectedSecondStep();
                }
            });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepLoad(
                'second step of break selection drawer - lsl24',
                'second step of break selection drawer',
            );
        } else {
            this.playBreakTrackingService.trackDrawerOpenedSecondStep();
        }
    }

    confirmSelection() {
        this.playBreakService.changePlayBreakWorkflow({
            step: PlayBreakWorkflowStep.Confirmation,
            notification: this.notification(),
        });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'select value',
                'second step of break selection drawer - lsl24',
                'continue',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackDrawerContinueSecondStep();
        }

        this.closeOverlay();
    }

    close() {
        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'not applicable',
                'second step of break selection drawer - lsl24',
                'cancel',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackDrawerCancelSecondStep();
        }

        this.closeOverlay();
    }
}
