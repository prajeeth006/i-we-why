import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { AnimationControl, AnimationControlService, MenuAction, MenuActionsService, OnFeatureInit } from '@frontend/vanilla/core';

import { SimpleDialogComponent, SimpleDialogData } from './simple-dialog.component';

@Injectable()
export class DialogBootstrapService implements OnFeatureInit {
    constructor(
        private animationControlService: AnimationControlService,
        private menuActionsService: MenuActionsService,
        private dialog: MatDialog,
    ) {}

    onFeatureInit() {
        this.animationControlService.addCondition((element: any) => {
            if (element.classList.contains('mat-dialog-container')) {
                return AnimationControl.Disable;
            }
            return;
        });

        this.menuActionsService.register(MenuAction.OPEN_DIALOG, (_origin, _url, _target, parameters) => {
            parameters = parameters || {};
            const data: MatDialogConfig<SimpleDialogData> = { data: { title: parameters.title, content: parameters.content } };
            this.dialog.open(SimpleDialogComponent, data);
        });
    }
}
