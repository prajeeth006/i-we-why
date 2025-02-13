import { Component, OnDestroy, OnInit } from '@angular/core';

import { HtmlNode, NavigationService } from '@frontend/vanilla/core';
import { TrustAsResourceUrlPipe } from '@frontend/vanilla/shared/browser';

import { LoginConfig } from '../login.client-config';

@Component({
    standalone: true,
    imports: [TrustAsResourceUrlPipe],
    selector: 'vn-danske-spil-login',
    templateUrl: 'danske-spil-login.html',
})
export class DanskeSpilLoginComponent implements OnInit, OnDestroy {
    url: string;

    constructor(
        private loginConfig: LoginConfig,
        private htmlNode: HtmlNode,
        private navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.url =
            this.loginConfig.loginUrl +
            encodeURIComponent(
                `${this.navigationService.location.baseUrl()}/${this.navigationService.location.culture}/labelhost/danske-spil-login-success`,
            );
        this.htmlNode.setCssClass('danske-spil-login', true);
    }

    ngOnDestroy() {
        this.htmlNode.setCssClass('danske-spil-login', false);
    }
}
