import { Injectable } from '@angular/core';

import {
    LoginResponseHandlerService,
    LoginStoreService,
    LoginType,
    Message,
    NativeAppService,
    NativeEventType,
    UserLoggingInEvent,
    UserService,
} from '@frontend/vanilla/core';
import { Subject } from 'rxjs';

import { LoginResourceService } from '../login-resource.service';
import { LoginService } from '../login.service';
import { BetstationLoginErrorOverlayService } from './betstation-login-error-overlay.service';

@Injectable({ providedIn: 'root' })
export class BetstationLoginService {
    onIncorrectPin: Subject<string> = new Subject();

    constructor(
        private betstationLoginErrorOverlayService: BetstationLoginErrorOverlayService,
        private loginResource: LoginResourceService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private loginService: LoginService,
        private loginStore: LoginStoreService,
        private nativeApplication: NativeAppService,
        private user: UserService,
    ) {}

    gridConnectLogin(model: any, onComplete: () => void) {
        this.user.triggerEvent(new UserLoggingInEvent());

        this.loginStore.LastVisitor = model.connectCardNumber;
        this.loginResource
            .login(model, { showSpinner: false })
            .subscribe({
                next: (data) => {
                    this.nativeApplication.sendToNative({
                        eventName: NativeEventType.PRELOGIN,
                        parameters: {
                            userName: model.username || model.connectCardNumber,
                            password: model.password || model.pin,
                        },
                    });

                    this.loginResponseHandlerService.handle(data).then((redirectInfo) => {
                        redirectInfo.goTo();
                    });
                },
                error: async (error) => {
                    await this.loginService.loginFailed({ reason: error, type: LoginType.ConnectCard });
                    if (error.vnMessages?.length > 0) {
                        const message = error.vnMessages[0] as Message;
                        //Do not close or show default error dialog when error is invalid attempts to block.
                        if (error.errorValues?.some((x: any) => x.key === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK')) {
                            this.onIncorrectPin.next(message.html);
                        } else {
                            this.betstationLoginErrorOverlayService.showError(message.html);
                        }
                    }
                },
            })
            .add(() => {
                onComplete();
            });
    }
}
