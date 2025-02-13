import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

/**
 * @whatItDoes Provides wrapper for a generic dialog element.
 *
 * @howToUse
 *
 * ```
 * <vn-dialog [headerTitle]="title" [headerCloseButtonText]="text" [showHeaderBackButton]="true | false" [showHeaderCloseIcon]="true | false">
 *      <ng-container content> <!-- Dialog content --> </ng-container>
 *      <ng-container actions> <!-- Action buttons --> </ng-container>
 * </vn-dialog>
 * ```
 *
 * @description
 *
 * Renders generic dialog element.
 *
 * @stable
 */
@Component({
    standalone: true,
    selector: 'vn-dialog',
    templateUrl: 'dialog.html',
    imports: [CommonModule, TrustAsHtmlPipe, IconCustomComponent],
})
export class DialogComponent {
    @Input() headerTitle: string | undefined;
    @Input() headerCloseButtonText: string | undefined;
    @Input() showHeaderBackButton: boolean = false;
    @Input() showHeaderCloseIcon: boolean = false;
    @Input() actionsLayout: 'actions-in-column' | 'actions-in-row' = 'actions-in-row';

    @Output() onClose = new EventEmitter<void>();

    close() {
        this.onClose.next();
    }
}
