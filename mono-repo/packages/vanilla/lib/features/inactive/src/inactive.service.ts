import { Injectable, inject } from '@angular/core';

import {
    AuthService,
    LoginService2,
    ToastrQueueService,
    ToastrType,
    UserService,
    WINDOW,
    WebWorkerService,
    WindowEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { IdleService } from '@frontend/vanilla/shared/idle';
import { ObservableInput, fromEvent, merge } from 'rxjs';
import { first } from 'rxjs/operators';

import { InactiveConfig } from './inactive.client-config';

@Injectable()
export class InactiveService {
    private config = inject(InactiveConfig);
    private toastrQueueService = inject(ToastrQueueService);
    private authService = inject(AuthService);
    private loginService = inject(LoginService2);
    private userService = inject(UserService);
    private webWorkerService = inject(WebWorkerService);
    private idleService = inject(IdleService);

    readonly #window = inject(WINDOW);

    private additionalActivityEvents: ObservableInput<any> = merge(
        fromEvent(this.#window, WindowEvent.TouchStart),
        fromEvent(this.#window, WindowEvent.Scroll),
    );

    init() {
        this.idleService
            .whenIdle(this.config.toastTimeout, {
                additionalActivityEvent: this.additionalActivityEvents,
            })
            .subscribe(() => this.showToast());
    }

    private showToast() {
        if (!this.userService.isAuthenticated || this.toastrQueueService.currentToast?.content.name === ToastrType.LogoutWarning) {
            return;
        }

        this.toastrQueueService.add(ToastrType.LogoutWarning);

        this.toastrQueueService.currentToast?.toast.onHidden.pipe(first()).subscribe(async () => {
            this.webWorkerService.removeWorker(WorkerType.InactiveLogoutTimeout);

            if (this.userService.isAuthenticated) {
                await this.authService.ping();
            }
        });

        this.setLogoutTimeout();
    }

    private setLogoutTimeout() {
        this.webWorkerService.createWorker(WorkerType.InactiveLogoutTimeout, { timeout: this.config.logoutTimeout }, () => {
            if (this.userService.isAuthenticated) {
                this.authService
                    .logout({ redirectAfterLogout: false, isAutoLogout: true })
                    .then(async () => await this.loginService.goTo({ forceReload: true }));
            } else if (this.toastrQueueService.currentToast?.content.name === ToastrType.LogoutWarning) {
                this.toastrQueueService.currentToast.toast.toastRef.manualClose();
            }
        });
    }
}
