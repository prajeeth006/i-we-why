import { Component, OnInit } from '@angular/core';

import {
    LoginResponse,
    LoginResponseHandlerService,
    LoginService2,
    MessageScope,
    NavigationService,
    SharedFeaturesApiService,
} from '@frontend/vanilla/core';

@Component({
    standalone: true,
    selector: 'lh-pending-workflow',
    template: '',
})
export class PendingWorkflowComponent implements OnInit {
    constructor(
        private api: SharedFeaturesApiService,
        private loginResponseHandler: LoginResponseHandlerService,
        private navigation: NavigationService,
        private loginService: LoginService2,
    ) {}

    ngOnInit() {
        const data = {
            nativeClientSessionKey: this.navigation.location.search.get('nativeClientSessionKey'),
            nativeClientUsertoken: this.navigation.location.search.get('nativeClientUsertoken'),
        };

        this.api
            .post('pendingworkflow', data, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            })
            .subscribe({
                next: (data: LoginResponse) => this.loginResponseHandler.handleResponse(data),
                error: () => this.loginService.goTo({ forceReload: true, storeMessageQueue: true }),
            });
    }
}
