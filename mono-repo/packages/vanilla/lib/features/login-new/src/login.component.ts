import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoginResponseHandlerService, LoginStoreService, MessageScope, UserLoggingInEvent, UserService } from '@frontend/vanilla/core';

import { ConnectCardLoginComponent } from './connect-card/connect-card-login.component';
import { DanskeSpilLoginComponent } from './danske-spil/danske-spil-login.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LoginResourceService } from './login-resource.service';
import { LoginConfig } from './login.client-config';
import { LoginOption } from './login.models';
import { PasswordComponent } from './password/password.component';
import { UsernameComponent } from './username/username.component';

// import { LoginTrackingService } from './login-tracking.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        ConnectCardLoginComponent,
        DanskeSpilLoginComponent,
        LoginButtonComponent,
        PasswordComponent,
        ReactiveFormsModule,
        UsernameComponent,
    ],
    selector: 'vn-login-new',
    templateUrl: 'login.component.html',
})
export class LoginComponent {
    form: FormGroup;
    LoginOption = LoginOption;
    loginOption: LoginOption;

    constructor(
        public config: LoginConfig,
        private loginResourceService: LoginResourceService,
        private loginStoreService: LoginStoreService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        // private loginTrackingService: LoginTrackingService,
        private userService: UserService,
        formBuilder: FormBuilder,
    ) {
        this.form = formBuilder.group({});
    }

    async login() {
        this.form.disable();
        this.userService.triggerEvent(new UserLoggingInEvent());
        // this.loginTrackingService.trackLoginBtnClicked(this.selectedLoginOption);

        this.loginResourceService
            .login(this.form.value, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            })
            .subscribe({
                next: async (data) => {
                    this.loginStoreService.LastVisitor = this.form.value.username;

                    if (data.isCompleted) {
                        // this.trackingService.trackLoginSuccess({ hasEntryMessage: this.hasEntryMessage });
                    }
                    // this.nativeApplication.sendToNative({
                    //     eventName: NativeEventType.PRELOGIN,
                    //     parameters: {
                    //         userName: this.form.value.username, // || model.connectCardNumber,
                    //         password: this.form.value.password, // || model.pin,
                    //         prefillUserName: false, // this.shouldPrefillUsername,
                    //         rememberMe: !!(this.loginConfig.rememberMeEnabled && model.rememberme),
                    //     },
                    // });
                    // if (model.fastloginenabled) {
                    //     this.wrapperSettingsService.update({
                    //         keepMeSignedInEnabled: model.fastloginenabled === FastLoginValues.keepMeSignedInEnabled,
                    //         isTouchIDLoginEnabled: model.fastloginenabled === FastLoginValues.isTouchIDEnabled,
                    //         isFaceIDLoginEnabled: model.fastloginenabled === FastLoginValues.isFaceIDEnabled,
                    //     });
                    //     this.trackingService.trackFastLoginSetting(model.fastloginenabled);
                    // }
                    await this.loginResponseHandlerService.handleResponse(data);
                },
                error: (error: any) => {
                    // eslint-disable-next-line no-console
                    console.log(error);
                },
            });

        // eslint-disable-next-line no-console
        console.log(this.form.value);
    }

    onBack() {
        throw new Error('Method not implemented.');
    }
}
