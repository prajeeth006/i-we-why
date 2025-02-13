import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AuthService, CommonMessages, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { first } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'vn-h-login-start-time',
    templateUrl: 'login-start-time.html',
})
export class LoginStartTimeComponent implements OnInit {
    message: string;

    constructor(
        private user: UserService,
        private authService: AuthService,
        private commonMessages: CommonMessages,
    ) {}

    ngOnInit() {
        if (this.user.isAuthenticated) {
            this.setLoginStartTime();
        } else {
            this.user.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => this.setLoginStartTime());
        }
    }

    private async setLoginStartTime() {
        const loginStartTime = await this.authService.loginStartTime();
        this.message = this.commonMessages.LoginStartTime?.replace('{login_start_time}', `<span class="start-time">${loginStartTime}</span>`) || '';
    }
}
