import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';

import { filter } from 'rxjs/operators';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { Page } from '../client-config/page.client-config';
import { LoginService2 } from '../login/login.service';
import { NavigationService } from '../navigation/navigation.service';
import { UrlService } from '../navigation/url.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RouterEventsBootstrapService implements OnAppInit {
    private previousUrl: string;

    constructor(
        private user: UserService,
        private router: Router,
        private navigationService: NavigationService,
        private loginService: LoginService2,
        private page: Page,
        private urlService: UrlService,
    ) {}

    onAppInit() {
        this.router.events.pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized)).subscribe(async (e: RoutesRecognized) => {
            const data = this.navigationService.getRouteData(e.state.root);
            const allowedWorkflows = new Set(data.workflowType ? (data.workflowType instanceof Array ? data.workflowType : [data.workflowType]) : []);
            const requiresAuth = data.authorized || (this.page.isAnonymousAccessRestricted && !data.allowAnonymous);
            const requiresWorkflow = !allowedWorkflows.has(0) && allowedWorkflows.size;

            if ((requiresAuth && !this.user.isAuthenticated) || (requiresWorkflow && !this.user.isAuthenticated && this.user.workflowType === 0)) {
                let returnUrl;

                // If anonymous user tries to access page that require authentication set rurl to requested page.
                // In another case set rurl to current url.
                if (requiresAuth) {
                    returnUrl = this.urlService.parse(e.url).absUrl();
                }
                await this.loginService.goTo({
                    appendReferrer: returnUrl || true,
                    referrerNeedsLoggedInUser: true,
                });
            } else {
                // check if next route needs an anonymous user
                if (data.onlyUnauthenticated && this.user.isAuthenticated) {
                    this.navigationService.goToLastKnownProduct();
                }

                if (data.allowedFrom) {
                    if (!this.previousUrl || data.allowedFrom.indexOf(this.previousUrl) === -1) {
                        this.navigationService.goToLastKnownProduct();
                    }
                }
            }
        });

        this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
            this.previousUrl = e.urlAfterRedirects;
        });
    }
}
