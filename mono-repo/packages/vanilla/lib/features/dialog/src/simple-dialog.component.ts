import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { DialogContentComponent } from './dialog-content.component';

export interface SimpleDialogData {
    title: string;
    content: string;
}

@Component({
    standalone: true,
    imports: [MatDialogModule, TrustAsHtmlPipe, DialogContentComponent],
    templateUrl: 'simple-dialog.html',
})
export class SimpleDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: SimpleDialogData) {}
}
