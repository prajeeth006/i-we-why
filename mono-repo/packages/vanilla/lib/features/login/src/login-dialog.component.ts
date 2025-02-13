import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { LoginDialogCloseType, LoginDialogData, NavigationService, UserEvent, UserPreHooksLoginEvent, UserService } from '@frontend/vanilla/core';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LoginComponent } from './login.component';

/**
 * @whatItDoes Hosts login component to be show inside a modal dialog using the login-dialoag.service.
 *
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [LoginComponent, MatDialogModule],
    selector: 'lh-login-dialog',
    templateUrl: 'login-dialog.component.html',
})
export class LoginDialogComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();

    constructor(
        private dialogRef: MatDialogRef<LoginDialogComponent>,
        private user: UserService,
        private navigationService: NavigationService,
        @Inject(MAT_DIALOG_DATA) public data: LoginDialogData,
    ) {}

    ngOnInit() {
        merge(this.navigationService.locationChange, this.user.events.pipe(filter((e: UserEvent) => e instanceof UserPreHooksLoginEvent)))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.close(LoginDialogCloseType.LoginOrNavigation);
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    close(closeType?: string) {
        const data: LoginDialogData = { ...this.data, closeType: closeType || LoginDialogCloseType.CloseButton };
        this.dialogRef.close(data);
    }
}
