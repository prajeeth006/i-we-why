import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    LoginDialogCloseType,
    LoginProviderProfile,
    MenuAction,
    MenuActionsService,
    NavigationService,
    Page,
    UserEvent,
    UserLoginEvent,
    UserService,
    UtilsService,
} from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { LoginProvidersService, ProviderLoginOptions } from '@frontend/vanilla/shared/login-providers';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LoginContentService } from './login-content.service';
import { LoginProviderButtonComponent } from './login-provider-button.component';
import { LoginTrackingService } from './login-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, LoginProviderButtonComponent, LhHeaderBarComponent],
    selector: 'vn-login-welcome-dialog',
    templateUrl: 'login-welcome-dialog.html',
})
export class LoginWelcomeDialogComponent implements OnInit, OnDestroy {
    welcomeDescription: string;

    private unsubscribe = new Subject<void>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: LoginProviderProfile,
        public loginContentService: LoginContentService,
        public loginConfig: LoginConfig,
        private page: Page,
        private utilsService: UtilsService,
        private dialogRef: MatDialogRef<LoginWelcomeDialogComponent>,
        private user: UserService,
        private navigationService: NavigationService,
        private menuActionsService: MenuActionsService,
        private loginProvidersService: LoginProvidersService,
        private loginTrackingService: LoginTrackingService,
    ) {}

    ngOnInit() {
        this.welcomeDescription = this.utilsService.format(
            this.loginContentService.content.messages?.WelcomeDescription || '',
            this.data.provider,
            this.page.domain,
        );

        merge(this.navigationService.locationChange, this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.close(LoginDialogCloseType.LoginOrNavigation);
            });

        this.loginTrackingService.trackProviderWelcomeScreen(this.data.provider);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    loginWithProvider() {
        const queryParams = this.loginContentService.content.form[`${this.data.provider}button`]?.values?.reduce((r: Record<string, string>, e) => {
            r[e.value] = e.text;
            return r;
        }, {});
        const providerConfig = this.loginConfig.providers[this.data.provider];

        const options: ProviderLoginOptions = {
            provider: this.data.provider,
        };

        if (queryParams) {
            options.queryParams = queryParams;
        }

        if (providerConfig?.redirectQueryParams) {
            options.redirectQueryParams = providerConfig.redirectQueryParams;
        }

        if (providerConfig?.sdkLogin) {
            this.loginProvidersService.sdkAuth(options);
        } else {
            this.loginProvidersService.urlAuth(options);
        }

        this.loginTrackingService.trackContinueWithProvider(this.data.provider);
    }

    close(closeType?: string) {
        const data = { ...this.data, closeType: closeType || LoginDialogCloseType.CloseButton };
        this.dialogRef.close(data);

        this.loginTrackingService.trackCloseProviderWelcomeScreen();
    }

    onWelcomeCancel() {
        const data = { ...this.data, closeType: LoginDialogCloseType.CloseButton };
        this.dialogRef.close(data);

        this.menuActionsService.invoke(MenuAction.GOTO_LOGIN, this.data.origin || this.page.homePage, [
            this.data.url,
            this.data.target,
            {
                ...this.data.parameters,
                welcomeCancel: true,
            },
        ]);

        this.loginTrackingService.trackLoginWithDifferentProvider();
    }
}
