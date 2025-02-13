import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { DemoCloseIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsModal, DsModalContent, DsModalHeader, DsModalHeaderVariant } from '@frontend/ui/modal';

@Component({
    selector: 'ds-demo-dialog-cmp',
    imports: [MatDialogModule, DsButton, DsModalHeader, DsIconButton, DemoCloseIconComponent, DsModal, DsModalContent],
    standalone: true,
    template: `
        <ds-modal>
            <ds-modal-header [variant]="data.variant">
                <div slot="start">
                    <div slot="title">Hello start</div>
                    <div slot="subtitle">Header subtitle</div>
                </div>

                <button slot="end" ds-icon-button size="small" mat-dialog-close>
                    <ds-demo-close-icon />
                </button>
            </ds-modal-header>
            <ds-modal-content>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, ducimus, sequi! Ab consequatur earum expedita fugit illo illum in
                maiores nihil nostrum officiis ratione repellendus temporibus, vel!
                <br />
                <br />
                <b>Lorem ipsum dolor sit amet</b>, consectetur adipisicing elit. Aliquam, ducimus, sequi! Ab consequatur earum expedita fugit illo
                illum in maiores nihil nostrum officiis ratione repellendus temporibus, vel!
                <br />
                <br />
                <div class="footer-buttons">
                    <button ds-button kind="secondary" variant="outline" mat-dialog-close>Outline Button</button>
                    <button ds-button kind="primary" variant="filled" mat-dialog-close>Filled Button</button>
                </div>
            </ds-modal-content>
        </ds-modal>
    `,
    styles: `
        ds-modal {
            width: 400px;
            min-height: 300px;
        }

        .footer-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoModalCmp {
    dialogRef = inject(MatDialogRef);
    data = inject<{ variant: DsModalHeaderVariant }>(MAT_DIALOG_DATA);
}

@Component({
    selector: 'ds-demo-dialog-container',
    imports: [MatDialogModule, DsButton],
    standalone: true,
    template: ` <button ds-button (click)="openDialog()">Open with Material Dialog</button> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoModalContainer {
    dialog = inject(MatDialog);

    variant = input<DsModalHeaderVariant>();

    openDialog() {
        this.dialog.open(DemoModalCmp, {
            data: {
                variant: this.variant(),
            },
        });
    }
}
