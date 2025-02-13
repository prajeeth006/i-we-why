import { Component, OnInit } from '@angular/core';

import { LoginResponseHandlerService, LoginService2, NavigationService, SharedFeaturesApiService } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    selector: 'lh-post-login-workflow',
    template: '',
})
export class PostLoginWorkflowComponent implements OnInit {
    constructor(
        private api: SharedFeaturesApiService,
        private navigation: NavigationService,
        private loginService: LoginService2,
        private loginResponseHandler: LoginResponseHandlerService,
    ) {}

    ngOnInit() {
        this.api.get('pendingworkflow/postlogin', {}, { showSpinner: false }).subscribe({
            next: async (data: any) => {
                if (data.isCompleted) {
                    await this.loginResponseHandler.runHooks(<any>{ response: {}, options: {} }, 'onPostLogin');
                } else {
                    this.navigation.goTo(data.redirectUrl);
                }
            },
            error: async () => await this.loginService.goTo(),
        });
    }
}
