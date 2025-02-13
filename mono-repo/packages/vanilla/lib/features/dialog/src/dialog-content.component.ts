import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';

/**
 * @whatItDoes Provides simple dialog layout with header bar.
 *
 * @howToUse
 *
 * ```
 * @Component({
 *     template: `
 *     <vn-dialog-content [title]="'Title'">
 *         <mat-dialog-content>
 *             Some text...
 *         </mat-dialog-content>
 *         <mat-dialog-actions>
 *             <button class="btn" [matDialogClose]="false">No</button>
 *             <button class="btn prominent" [matDialogClose]="true" cdkFocusInitial>Yes</button>
 *         </mat-dialog-actions>
 *     </vn-dialog-content>
 *     `
 * })
 * export class ExampleDialogComponent {
 * }
 * ```
 *
 * ```
 * this.dialog.open(ExampleDialogComponent);
 * ```
 *
 * @description
 *
 * A wrapper helper for `@angular/material` dialog component that will render the `vn-header-bar` with specified title,
 * and automatically hide the close button if `disableClose` is set on the dialog. The content of this component will be
 * rendered below the header bar.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [HeaderBarComponent, MatDialogModule],
    selector: 'vn-dialog-content',
    templateUrl: 'dialog-content.html',
})
export class DialogContentComponent {
    @Input() title: string;
    @Output() onClose = new EventEmitter<void>();

    closeDisabled: boolean | undefined;

    constructor(private dialogRef: MatDialogRef<any>) {
        this.closeDisabled = dialogRef.disableClose;
    }

    close() {
        this.onClose.next();
        this.dialogRef.close();
    }
}
