import { Component, OnInit } from '@angular/core';

import { LoginService2, NavigationService, SharedFeaturesApiService } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    selector: 'lh-pending-post-login-workflow',
    template: '',
})
export class PendingPostLoginWorkflowComponent implements OnInit {
    constructor(
        private api: SharedFeaturesApiService,
        private navigation: NavigationService,
        private loginService: LoginService2,
    ) {}

    ngOnInit() {
        this.api.get('pendingworkflow/postloginredirecturl', {}, { showSpinner: false }).subscribe({
            next: (data: any) => this.navigation.goTo(data.redirectUrl),
            error: async () => await this.loginService.goTo(),
        });
    }
}
