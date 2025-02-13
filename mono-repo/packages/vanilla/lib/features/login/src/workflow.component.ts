import { Component, OnInit } from '@angular/core';

import {
    LoginResponse,
    LoginResponseHandlerService,
    LoginService2,
    LoginStoreService,
    MessageScope,
    NavigationService,
    SharedFeaturesApiService,
} from '@frontend/vanilla/core';

@Component({
    standalone: true,
    selector: 'vn-workflow',
    template: '',
})
export class WorkflowComponent implements OnInit {
    constructor(
        private api: SharedFeaturesApiService,
        private loginResponseHandler: LoginResponseHandlerService,
        private navigation: NavigationService,
        private loginService: LoginService2,
        private loginStore: LoginStoreService,
    ) {}

    ngOnInit() {
        const data = {
            nativeClientSessionKey: this.navigation.location.search.get('nativeClientSessionKey'),
            nativeClientUsertoken: this.navigation.location.search.get('nativeClientUsertoken'),
        };

        this.api.post('pendingworkflow', data, { showSpinner: false, messageQueueScope: MessageScope.Login }).subscribe({
            next: (data: LoginResponse) => {
                this.loginStore.enablePostLoginCcbDelay();
                this.loginResponseHandler.handleResponse(data);
            },
            error: async () => await this.loginService.goTo({ forceReload: true, storeMessageQueue: true }),
        });
    }
}
