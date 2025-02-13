import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { HtmlNode, LoginNavigationService, NavigationService, UrlService, UserService, WINDOW } from '@frontend/vanilla/core';
import { CrossProductLayoutComponent } from '@frontend/vanilla/features/cross-product-layout';

import { LoginComponent } from './login.component';

@Component({
    standalone: true,
    imports: [CommonModule, LoginComponent, CrossProductLayoutComponent],
    selector: 'lh-login-standalone',
    templateUrl: 'login-standalone.component.html',
})
export class LoginStandaloneComponent implements OnInit, OnDestroy {
    readonly #window = inject(WINDOW);

    constructor(
        public user: UserService,
        private navigation: NavigationService,
        private loginNavigation: LoginNavigationService,
        private htmlNode: HtmlNode,
        private urlService: UrlService,
    ) {}

    ngOnInit() {
        this.setAuthRequired(this.navigation.location.search.get('rurlauth') === '1');
        this.htmlNode.setCssClass('login-page', true);
        this.loginNavigation.storeReturnUrlFromQuerystring();
        if (this.user.isAuthenticated) {
            this.loginNavigation.goToStoredReturnUrl();
        }
    }

    ngOnDestroy(): void {
        this.htmlNode.setCssClass('login-page', false);
        this.setAuthRequired(false);
    }

    back() {
        const cancelUrl = this.navigation.location.search.get('cancelUrl');
        if (cancelUrl && this.urlService.parse(cancelUrl).isSameTopDomain) {
            this.loginNavigation.goToWithCurrentLang(cancelUrl);
            return;
        }

        if (this.navigation.location.search.get('rurlauth') === '1' || this.#window.history.length === 0) {
            this.navigation.goToLastKnownProduct();
            return;
        }

        this.#window.history.back();
    }

    private setAuthRequired(active: boolean) {
        this.#window['vnAuthRequired'] = active;
    }
}
